const express = require('express');
const router = express.Router();

const cache = new Map();

async function fetchWithRetry(url, retries = 5, backoffMs = 200) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      if (i === retries - 1) return response;
    } catch (err) {
      if (i === retries - 1) throw err;
    }
    await new Promise(resolve => setTimeout(resolve, backoffMs * Math.pow(2, i)));
  }
}

function mapWMOtoOWM(wmoCode) {
  if (wmoCode === 0) return { main: 'Clear', description: 'clear sky', icon: '01d' };
  if ([1, 2, 3].includes(wmoCode)) return { main: 'Clouds', description: 'cloudy', icon: '03d' };
  if ([45, 48].includes(wmoCode)) return { main: 'Fog', description: 'foggy', icon: '50d' };
  if ([51, 53, 55].includes(wmoCode)) return { main: 'Drizzle', description: 'drizzle', icon: '09d' };
  if ([61, 63, 65, 80, 81, 82].includes(wmoCode)) return { main: 'Rain', description: 'rainy', icon: '10d' };
  if ([71, 73, 75, 77, 85, 86].includes(wmoCode)) return { main: 'Snow', description: 'snow', icon: '13d' };
  if ([95, 96, 99].includes(wmoCode)) return { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' };
  return { main: 'Clear', description: 'clear sky', icon: '01d' };
}

router.get('/', async (req, res) => {
  let { lat, lon, city } = req.query;
  let locName = 'Unknown Location';

  try {
    if (city && (!lat || !lon)) {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      let geoData;
      if (cache.has(geoUrl) && Date.now() - cache.get(geoUrl).timestamp < 3600000) geoData = cache.get(geoUrl).data;
      else {
        const geoRes = await fetchWithRetry(geoUrl);
        geoData = await geoRes.json();
        cache.set(geoUrl, { timestamp: Date.now(), data: geoData });
      }

      if (!geoData.results || geoData.results.length === 0) return res.status(404).json({ error: 'City not found' });
      lat = geoData.results[0].latitude;
      lon = geoData.results[0].longitude;
      locName = geoData.results[0].name;
    } else if (lat && lon) {
      locName = `Lat: ${parseFloat(lat).toFixed(2)}, Lon: ${parseFloat(lon).toFixed(2)}`;
    } else {
      return res.status(400).json({ error: 'Please provide either lat/lon or city' });
    }

    const hourlyParams = [
      "temperature_2m", "relative_humidity_2m", "dew_point_2m", "apparent_temperature",
      "precipitation_probability", "rain", "precipitation", "showers", "snowfall",
      "snow_depth", "weather_code", "pressure_msl", "surface_pressure", "cloud_cover",
      "cloud_cover_low", "cloud_cover_mid", "cloud_cover_high", "visibility",
      "evapotranspiration", "et0_fao_evapotranspiration", "vapour_pressure_deficit",
      "wind_speed_10m", "wind_speed_180m", "wind_direction_180m",
      "soil_moisture_27_to_81cm", "soil_temperature_54cm"
    ].join(',');

    const dailyParams = [
      "weather_code", "temperature_2m_max", "temperature_2m_min",
      "temperature_2m_mean", "cloud_cover_mean", "cloud_cover_max", "cloud_cover_min", 
      "wind_speed_10m_mean", "wind_gusts_10m_mean", "wind_gusts_10m_min", "wind_speed_10m_min", 
      "visibility_max", "visibility_min", "visibility_mean", "sunrise", "sunset", 
      "daylight_duration", "sunshine_duration", "apparent_temperature_max", "apparent_temperature_min"
    ].join(',');

    const currentParams = [
      "temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "weather_code", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m", "visibility"
    ].join(',');

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=${hourlyParams}&current=${currentParams}&daily=${dailyParams}&forecast_days=15&timezone=auto`;

    let weatherData;
    if (cache.has(url) && Date.now() - cache.get(url).timestamp < 3600000) {
      weatherData = cache.get(url).data;
    } else {
      const weatherRes = await fetchWithRetry(url);
      weatherData = await weatherRes.json();
      
      try { // Fetch AQI
        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5`;
        const aqiRes = await fetch(aqiUrl);
        const aqiData = await aqiRes.json();
        weatherData.aqi = aqiData.current ? { aqi: aqiData.current.us_aqi, pm25: aqiData.current.pm2_5 } : null;
      } catch (e) { weatherData.aqi = null; }

      if (!weatherData.error) cache.set(url, { timestamp: Date.now(), data: weatherData });
    }

    if (weatherData.error) return res.status(400).json({ error: weatherData.reason });

    const current = weatherData.current;
    const nowSecs = Date.now() / 1000;
    const hourlyList = [];
    const hourlyData = weatherData.hourly;

    if (hourlyData && hourlyData.time) {
      for (let i = 0; i < hourlyData.time.length; i++) {
        const tSecs = new Date(hourlyData.time[i] + 'Z').getTime() / 1000;
        if (tSecs > nowSecs - 3600) {
          hourlyList.push({
            dt: tSecs,
            main: { temp: hourlyData.temperature_2m[i] },
            weather: [mapWMOtoOWM(hourlyData.weather_code[i])]
          });
          if (hourlyList.length >= 24) break;
        }
      }
    }

    const payload = {
      current: {
        name: locName,
        coord: { lat: parseFloat(lat), lon: parseFloat(lon) },
        weather: [mapWMOtoOWM(current.weather_code)],
        main: {
          temp: current.temperature_2m,
          feels_like: current.apparent_temperature,
          humidity: current.relative_humidity_2m,
          temp_max: weatherData.daily ? weatherData.daily.temperature_2m_max[0] : 0,
          temp_min: weatherData.daily ? weatherData.daily.temperature_2m_min[0] : 0
        },
        wind: { speed: current.wind_speed_10m },
        visibility: current.visibility || 10000, 
        is_day: current.is_day,
        air_quality: weatherData.aqi
      },
      daily: weatherData.daily,
      forecast: hourlyList,
      raw_hourly_expert_data: hourlyData
    };

    res.json(payload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Extended API Error: ' + error.message });
  }
});

module.exports = router;
