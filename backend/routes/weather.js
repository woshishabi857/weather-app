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
      // 直接使用固定的地区名称，例如海南
      // 实际应用中，可以使用更可靠的地理编码服务
      locName = "Hainan, China";
    } else {
      return res.status(400).json({ error: 'Please provide either lat/lon or city' });
    }

    // 获取更全面的天气数据
    const hourlyParams = "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,wind_direction_10m,pressure_msl,visibility";
    const dailyParams = "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max";
    const currentParams = "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility,precipitation";

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=${hourlyParams}&current=${currentParams}&daily=${dailyParams}&forecast_days=15&timezone=Asia/Shanghai`;

    let weatherData;
    // 暂时禁用缓存，以便测试
    // if (cache.has(url) && Date.now() - cache.get(url).timestamp < 3600000) {
    //   weatherData = cache.get(url).data;
    // } else {
      try {
        const weatherRes = await fetchWithRetry(url);
        weatherData = await weatherRes.json();
        
        try { // Fetch AQI
          const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5`;
          const aqiRes = await fetch(aqiUrl);
          const aqiData = await aqiRes.json();
          weatherData.aqi = aqiData.current ? { aqi: aqiData.current.us_aqi, pm25: aqiData.current.pm2_5 } : null;
        } catch (e) { weatherData.aqi = null; }

        if (!weatherData.error) cache.set(url, { timestamp: Date.now(), data: weatherData });
      } catch (e) {
        console.error('API fetch error:', e);
        // 如果API请求失败，返回错误信息
        res.status(500).json({ 
          error: 'API connection error. Please try again later.',
          details: e.message 
        });
        return;
      }
    // }

    if (weatherData.error) return res.status(400).json({ error: weatherData.reason });

    const current = weatherData.current;
    const nowSecs = Date.now() / 1000;
    const hourlyList = [];
    const hourlyData = weatherData.hourly;

    if (hourlyData && hourlyData.time) {
      // 从API返回的hourly数据中找到与current温度最接近的时间点
      let startIndex = 0;
      let minTempDiff = Infinity;
      const currentTemp = current.temperature_2m;
      
      for (let i = 0; i < hourlyData.temperature_2m.length; i++) {
        const tempDiff = Math.abs(hourlyData.temperature_2m[i] - currentTemp);
        if (tempDiff < minTempDiff) {
          minTempDiff = tempDiff;
          startIndex = i;
        }
      }
      
      console.log('Current temperature:', currentTemp);
      console.log('Found start index:', startIndex);
      console.log('Temperature at start index:', hourlyData.temperature_2m[startIndex]);
      
      // 确保索引在有效范围内
      if (startIndex < 0) startIndex = 0;
      if (startIndex >= hourlyData.time.length) startIndex = hourlyData.time.length - 1;
      
      // 从当前索引开始获取24小时数据
      for (let i = startIndex; i < hourlyData.time.length && hourlyList.length < 24; i++) {
        const timeStr = hourlyData.time[i];
        // 解析时间字符串，确保它被当作本地时间处理
        const [datePart, timePart] = timeStr.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);
        const hourTime = new Date(year, month - 1, day, hour, minute);
        const tSecs = hourTime.getTime() / 1000;
        
        hourlyList.push({
          dt: tSecs,
          main: { temp: hourlyData.temperature_2m[i] },
          weather: [mapWMOtoOWM(hourlyData.weather_code[i])]
        });
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
        temp_min: weatherData.daily ? weatherData.daily.temperature_2m_min[0] : 0,
        pressure: current.pressure_msl
      },
      wind: { 
        speed: current.wind_speed_10m,
        direction: current.wind_direction_10m
      },
      visibility: current.visibility || 10000, 
      precipitation: current.precipitation,
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
    res.status(500).json({ 
      error: 'API connection error. Please try again later.',
      details: error.message 
    });
  }
});

module.exports = router;
