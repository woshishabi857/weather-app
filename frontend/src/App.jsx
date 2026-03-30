import React, { useState, useEffect } from 'react';
import './index.css';

const API_BASE_URL = 'http://localhost:5001/api';

// Celestial Background Engine (Sun/Moon/Stars/Weather Effects)
const CelestialEffects = ({ is_day, weather }) => {
  if (is_day === undefined || is_day === null) return null;

  // Determine weather intensity based on condition
  const getWeatherIntensity = () => {
    if (!weather) return 0;
    const weatherLower = weather.toLowerCase();
    if (weatherLower.includes('rain') || weatherLower.includes('thunder')) return 1;
    if (weatherLower.includes('cloud')) return 0.6;
    if (weatherLower.includes('snow')) return 0.8;
    return 0;
  };

  const weatherIntensity = getWeatherIntensity();
  const isCloudy = weather && weather.toLowerCase().includes('cloud');
  const isRainy = weather && (weather.toLowerCase().includes('rain') || weather.toLowerCase().includes('thunder'));
  const isSnowy = weather && weather.toLowerCase().includes('snow');

  if (is_day === 1) {
    return (
      <div className="celestial-layer">
        {/* Sun with weather effects */}
        <div className="sun-body" style={{ 
          width: '350px', 
          height: '350px',
          boxShadow: '0 0 100px rgba(255, 230, 100, 0.8)',
          opacity: Math.max(0.3, 1 - weatherIntensity * 0.7)
        }}></div>
        
        {/* Sun rays effect */}
        <div style={{ 
          position: 'absolute',
          top: '8vh',
          left: '15vw',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 230, 100, 0.2) 0%, rgba(255, 200, 50, 0.1) 40%, rgba(255, 255, 255, 0) 70%)',
          animation: 'sun-pulse 4s infinite alternate',
          opacity: Math.max(0.2, 1 - weatherIntensity * 0.8)
        }}></div>

        {/* Clouds for cloudy weather */}
        {isCloudy && (
          <>
            {/* Larger cloud with multiple layers */}
            <div style={{
              position: 'absolute',
              top: '20vh',
              left: '10vw',
              width: '250px',
              height: '100px',
              animation: 'cloud-float 30s infinite linear'
            }}>
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                width: '180px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '40px'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '50px',
                width: '120px',
                height: '70px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50px'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '80px',
                width: '100px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '40px'
              }}></div>
            </div>
            
            {/* Smaller cloud with different shape */}
            <div style={{
              position: 'absolute',
              top: '15vh',
              right: '15vw',
              width: '180px',
              height: '80px',
              animation: 'cloud-float 35s infinite linear reverse'
            }}>
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '10px',
                width: '140px',
                height: '50px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '30px'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '40px',
                width: '90px',
                height: '55px',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '40px'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '60px',
                width: '70px',
                height: '45px',
                background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '30px'
              }}></div>
            </div>
          </>
        )}

        {/* Rain for rainy weather */}
        {isRainy && Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`rain-${i}`}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '20px',
              background: 'rgba(174, 194, 224, 0.6)',
              animation: `rain-fall ${0.5 + Math.random() * 0.3}s infinite linear`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}

        {/* Snow for snowy weather */}
        {isSnowy && Array.from({ length: 60 }).map((_, i) => (
          <div
            key={`snow-${i}`}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              animation: `snow-fall ${3 + Math.random() * 2}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    );
  } else {
    // Generate Night Stars
    const stars = Array.from({ length: 120 }).map((_, i) => {
      const size = 1 + Math.random() * 3;
      return (
        <div
          key={i}
          className="star-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 80}%`,
            width: `${size}px`,
            height: `${size}px`,
            '--twinkle-dur': `${1 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.max(0.3, 1 - weatherIntensity * 0.8)
          }}
        />
      );
    });

    return (
      <div className="celestial-layer">
        {/* Moon with weather effects */}
        <div className="moon-body" style={{ 
          width: '250px', 
          height: '250px',
          boxShadow: '0 0 80px rgba(255, 255, 255, 0.6)',
          opacity: Math.max(0.3, 1 - weatherIntensity * 0.7)
        }}></div>
        
        {/* Moon glow effect */}
        <div style={{ 
          position: 'absolute',
          top: '10vh',
          right: '15vw',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(200, 200, 220, 0.1) 40%, rgba(255, 255, 255, 0) 70%)',
          animation: 'moon-hover 8s infinite alternate ease-in-out',
          opacity: Math.max(0.2, 1 - weatherIntensity * 0.8)
        }}></div>

        {/* Clouds for cloudy weather */}
        {isCloudy && (
          <>
            {/* Larger cloud with multiple layers */}
            <div style={{
              position: 'absolute',
              top: '20vh',
              left: '10vw',
              width: '250px',
              height: '100px',
              animation: 'cloud-float 30s infinite linear'
            }}>
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                width: '180px',
                height: '60px',
                background: 'rgba(200, 200, 220, 0.4)',
                borderRadius: '40px'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '50px',
                width: '120px',
                height: '70px',
                background: 'rgba(200, 200, 220, 0.5)',
                borderRadius: '50px'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '80px',
                width: '100px',
                height: '60px',
                background: 'rgba(200, 200, 220, 0.3)',
                borderRadius: '40px'
              }}></div>
            </div>
            
            {/* Smaller cloud with different shape */}
            <div style={{
              position: 'absolute',
              top: '15vh',
              right: '15vw',
              width: '180px',
              height: '80px',
              animation: 'cloud-float 35s infinite linear reverse'
            }}>
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '10px',
                width: '140px',
                height: '50px',
                background: 'rgba(200, 200, 220, 0.3)',
                borderRadius: '30px'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '40px',
                width: '90px',
                height: '55px',
                background: 'rgba(200, 200, 220, 0.4)',
                borderRadius: '40px'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '60px',
                width: '70px',
                height: '45px',
                background: 'rgba(200, 200, 220, 0.2)',
                borderRadius: '30px'
              }}></div>
            </div>
          </>
        )}

        {/* Rain for rainy weather */}
        {isRainy && Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`rain-${i}`}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '20px',
              background: 'rgba(174, 194, 224, 0.4)',
              animation: `rain-fall ${0.5 + Math.random() * 0.3}s infinite linear`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}

        {/* Snow for snowy weather */}
        {isSnowy && Array.from({ length: 60 }).map((_, i) => (
          <div
            key={`snow-${i}`}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%',
              animation: `snow-fall ${3 + Math.random() * 2}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}

        {stars}
      </div>
    );
  }
};

// Weather Particle Engine
const WeatherEffects = ({ weather }) => {
  if (!weather) return null;
  const condition = weather.toLowerCase();

  if (condition.includes('rain') || condition.includes('drizzle')) {
    const drops = Array.from({ length: 40 }).map((_, i) => (
      <div
        key={i}
        className="raindrop"
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${0.5 + Math.random() * 0.5}s`,
          animationDelay: `${Math.random() * 2}s`
        }}
      />
    ));
    return <div className="weather-effects-layer">{drops}</div>;
  }

  if (condition.includes('snow')) {
    const flakes = Array.from({ length: 60 }).map((_, i) => {
      const size = 3 + Math.random() * 5;
      return (
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${3 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      );
    });
    return <div className="weather-effects-layer">{flakes}</div>;
  }

  return null;
};

// Helper for AQI quality mapping
function getAQILabel(aqi) {
  if (!aqi) return { text: "Unknown", color: "#ccc" };
  if (aqi <= 50) return { text: "Good", color: "#4CAF50" };
  if (aqi <= 100) return { text: "Moderate", color: "#FFEB3B" };
  if (aqi <= 150) return { text: "Unhealthy for Sensitive Groups", color: "#FF9800" };
  if (aqi <= 200) return { text: "Unhealthy", color: "#F44336" };
  if (aqi <= 300) return { text: "Very Unhealthy", color: "#9C27B0" };
  return { text: "Hazardous", color: "#b71c1c" };
}

// Helper for wind direction
function getWindDirection(degrees) {
  if (!degrees) return "Unknown";
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

// Helper for UV index level
function getUVIndexLevel(index) {
  if (index <= 2) return "Low";
  if (index <= 5) return "Moderate";
  if (index <= 7) return "High";
  if (index <= 10) return "Very High";
  return "Extreme";
}

// Map WMO to Main weather strings for daily icon rendering
function getIconForWMO(wmoCode) {
  if (wmoCode === 0) return '01d';
  if ([1, 2, 3].includes(wmoCode)) return '03d';
  if ([45, 48].includes(wmoCode)) return '50d';
  if ([51, 53, 55].includes(wmoCode)) return '09d';
  if ([61, 63, 65, 80, 81, 82].includes(wmoCode)) return '10d';
  if ([71, 73, 75, 77, 85, 86].includes(wmoCode)) return '13d';
  if ([95, 96, 99].includes(wmoCode)) return '11d';
  return '01d';
}

function App() {
  const [searchCity, setSearchCity] = useState('');
  const [data, setData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UX Features States
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [saveShake, setSaveShake] = useState(false);

  useEffect(() => {
    fetchLocations();
    // 尝试获取用户地理位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`${API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}`);
            const payload = await res.json();
            if (res.ok) {
              setData(payload);
              setCurrentLocation({
                name: payload.current.name,
                lat: payload.current.coord.lat,
                lon: payload.current.coord.lon,
                isCurrentLocation: true
              });
            }
          } catch (err) {
            console.error('Error fetching weather by geolocation:', err);
            // 如果地理位置获取失败，默认显示上海天气
            fetchWeather('Shanghai');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          // 如果用户拒绝地理位置访问，默认显示上海天气
          fetchWeather('Shanghai');
        }
      );
    } else {
      // 浏览器不支持地理位置，默认显示上海天气
      fetchWeather('Shanghai');
    }
  }, []);

  // Debounced Auto-suggestions
  useEffect(() => {
    if (!searchCity || searchCity.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=5&language=en&format=json`);
        const json = await res.json();
        if (json.results) {
          setSuggestions(json.results);
          setShowDropdown(true);
        }
      } catch (e) { }
    }, 300); // 300ms sweet spot for typing
    return () => clearTimeout(timer);
  }, [searchCity]);

  useEffect(() => {
    // Dynamic background based on weather condition
    if (data?.current?.weather?.[0]?.main) {
      const condition = data.current.weather[0].main.toLowerCase();
      document.body.className = '';
      if (condition.includes('clear')) document.body.classList.add('bg-clear');
      else if (condition.includes('cloud')) document.body.classList.add('bg-clouds');
      else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunder')) document.body.classList.add('bg-rain');
      else if (condition.includes('snow')) document.body.classList.add('bg-snow');
      else document.body.classList.add('bg-default');
    }
  }, [data]);

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/locations`);
      if (res.ok) {
        const d = await res.json();
        setLocations(d);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeather = async (city) => {
    if (!city) return;
    setLoading(true); setError(null); setShowDropdown(false);
    try {
      const res = await fetch(`${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Failed to fetch weather');
      setData(payload);
      setSearchCity('');
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentLocation = async () => {
    if (!data?.current) return;

    // De-duplication check
    const exists = locations.find(loc => loc.name.toLowerCase() === data.current.name.toLowerCase());
    if (exists) {
      setSaveShake(true);
      setTimeout(() => setSaveShake(false), 500);
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.current.name,
          lat: data.current.coord?.lat || 0,
          lon: data.current.coord?.lon || 0
        })
      });
      fetchLocations();
    } catch (err) { }
  };

  const deleteLocation = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/locations/${id}`, { method: 'DELETE' });
      fetchLocations();
    } catch (err) { }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatISOToTime = (isoString) => {
    if (!isoString) return '--:--';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRecommendation = () => {
    if (!data?.current) return '';
    const temp = data.current.main.temp;
    const weather = data.current.weather[0].main.toLowerCase();

    let recs = [];
    if (temp < 10) recs.push("It's quite cold out there. Definitely wear a heavy jacket.");
    else if (temp < 20) recs.push("A bit chilly. A light sweater or jacket is recommended.");
    else if (temp > 30) recs.push("It's hot! Wear light clothing and stay hydrated.");
    else recs.push("Comfortable temperature today.");

    if (weather.includes('rain') || weather.includes('drizzle') || weather.includes('thunder')) {
      recs.push("Don't forget your umbrella, it looks rainy.");
    } else if (weather.includes('clear')) {
      if (temp > 25) recs.push("Perfect clear skies! High UV expected, apply sunscreen.");
    } else if (weather.includes('snow')) {
      recs.push("Snow is expected. Wear boots and drive safely!");
    }

    return recs.join(" ");
  };

  const aqiObj = getAQILabel(data?.current?.air_quality?.aqi);

  return (
    <>
      <CelestialEffects is_day={data?.current?.is_day} weather={data?.current?.weather?.[0]?.main} />
      <WeatherEffects weather={data?.current?.weather?.[0]?.main} />

      <div className="ios-layout">
        {/* Sidebar Panel */}
        <aside className="glass-panel" style={{ display: 'flex', flexDirection: 'column', zIndex: 10, overflow: 'visible' }}>
          <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600', letterSpacing: '0.5px' }}>Weather</h1>

          <form onSubmit={(e) => { e.preventDefault(); fetchWeather(searchCity); }} className="search-container">
            <input
              type="text"
              placeholder="Search for a city or airport"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="search-input"
            />
            {showDropdown && suggestions.length > 0 && (
              <div className="search-dropdown">
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="search-option"
                    onClick={() => {
                      setSearchCity(s.name);
                      fetchWeather(s.name);
                    }}
                  >
                    <div className="search-option-title">{s.name}</div>
                    <div className="search-option-sub">{s.admin1 ? `${s.admin1}, ` : ''}{s.country}</div>
                  </div>
                ))}
              </div>
            )}
          </form>

          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {/* Current Location at the top */}
            {currentLocation && (
              <div className="location-item" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                <div onClick={() => fetchWeather(currentLocation.name)} style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📍 {currentLocation.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Current Location • Lat: {currentLocation.lat?.toFixed(2)} • Lon: {currentLocation.lon?.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
            
            {/* Saved Locations */}
            {locations.map(loc => (
              <div key={loc.id} className="location-item">
                <div onClick={() => fetchWeather(loc.name)} style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '500' }}>{loc.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Lat: {loc.lat?.toFixed(2)} • Lon: {loc.lon?.toFixed(2)}
                  </div>
                </div>
                <button className="delete-btn" onClick={() => deleteLocation(loc.id)}>×</button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Glass Dashboard */}
        <main className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ margin: 'auto' }}>Loading weather data...</div>
          ) : error ? (
            <div style={{ margin: 'auto', color: '#ff3b30' }}>{error}</div>
          ) : data?.current ? (
            <div className="weather-content-scroll">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-10px', marginBottom: '-20px' }}>
                <button
                  onClick={saveCurrentLocation}
                  className={saveShake ? 'shake' : ''}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  + Add
                </button>
              </div>

              <div className="weather-hero">
                <div className="city">{data.current.name}</div>
                <div className="temp">{Math.round(data.current.main.temp)}°</div>
                <div className="desc">{data.current.weather[0].description}</div>
                <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: '500' }}>
                  H:{Math.round(data.current.main.temp_max)}°
                  L:{Math.round(data.current.main.temp_min)}°
                </div>
              </div>

              <div className="widget-grid">

                {/* Intelligent Recommendation */}
                <div className="glass-widget widget-full" style={{ marginBottom: '8px' }}>
                  <div className="widget-header">💡 Travel & Comfort Insights</div>
                  <div style={{ fontSize: '16px', lineHeight: '1.5' }}>
                    {getRecommendation()}
                  </div>
                </div>

                {/* Hourly Forecast */}
                <div className="glass-widget widget-full" style={{ marginBottom: '8px' }}>
                  <div className="widget-header">🕒 24-Hour Forecast</div>
                  <div className="hourly-container">
                    {data.forecast && data.forecast.length > 0 ? data.forecast.map((item, i) => (
                      <div className="hourly-item" key={item.dt}>
                        <div className="time">{i === 0 ? 'Now' : formatTime(item.dt)}</div>
                        <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="icon" style={{ width: '40px' }} />
                        <div className="temp">{Math.round(item.main.temp)}°</div>
                      </div>
                    )) : (
                      <div>No hourly data available.</div>
                    )}
                  </div>
                </div>

                {/* 15-DAY DAILY FORECAST WIDGET */}
                {data.daily && data.daily.time && (
                  <div className="glass-widget widget-full" style={{ marginBottom: '8px' }}>
                    <div className="widget-header">📅 15-Day Forecast</div>
                    <div className="daily-forecast-list">
                      {data.daily.time.slice(0, 15).map((dateStr, i) => {
                        const dateObj = new Date(dateStr);
                        const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                        const iconWMO = data.daily.weather_code[i];
                        const tMin = Math.round(data.daily.temperature_2m_min[i]);
                        const tMax = Math.round(data.daily.temperature_2m_max[i]);

                        return (
                          <div key={dateStr} className="daily-forecast-row">
                            <div className="daily-forecast-day">{dayName}</div>
                            <img
                              src={`https://openweathermap.org/img/wn/${getIconForWMO(iconWMO)}.png`}
                              alt="weather icon"
                              style={{ width: '30px', height: '30px', opacity: 0.9 }}
                            />
                            <div className="daily-forecast-temp-range">
                              <span className="daily-temp-min">{tMin}°</span>
                              {/* Visual Temp Bar Indicator (mock representation) */}
                              <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '20%', right: '20%', background: 'linear-gradient(90deg, #A1C4FD, #FFC107)' }}></div>
                              </div>
                              <span className="daily-temp-max">{tMax}°</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="glass-widget">
                  <div className="widget-header">😷 Air Quality (AQI)</div>
                  <div className="widget-value">{data.current.air_quality ? data.current.air_quality.aqi : '--'}</div>
                  <div style={{ marginTop: 'auto', fontSize: '15px', color: aqiObj.color, fontWeight: '600' }}>
                    {aqiObj.text}
                  </div>
                </div>

                <div className="glass-widget">
                  <div className="widget-header">🌅 Sunrise & Sunset</div>
                  <div style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px', marginTop: '4px' }}>
                    ☀️ {data.daily && data.daily.sunrise && data.daily.sunrise.length > 0 ? formatISOToTime(data.daily.sunrise[0]) : '--:--'}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '500' }}>
                    🌇 {data.daily && data.daily.sunset && data.daily.sunset.length > 0 ? formatISOToTime(data.daily.sunset[0]) : '--:--'}
                  </div>
                </div>

                <div className="glass-widget">
                  <div className="widget-header">💨 Wind</div>
                  <div className="widget-value">{data.current.wind.speed} <span className="widget-unit">m/s</span></div>
                </div>

                <div className="glass-widget">
                  <div className="widget-header">💧 Humidity</div>
                  <div className="widget-value">{data.current.main.humidity} <span className="widget-unit">%</span></div>
                  <div style={{ marginTop: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>The dew point is {Math.round(data.current.main.temp - ((100 - data.current.main.humidity) / 5))}° right now.</div>
                </div>

                <div className="glass-widget">
                  <div className="widget-header">👁 Visibility</div>
                  <div className="widget-value">{data.current.visibility ? Math.round(data.current.visibility / 1000) : 10} <span className="widget-unit">km</span></div>
                  <div style={{ marginTop: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>{data.current.visibility >= 10000 ? 'Perfectly clear view.' : 'Cloudy or hazy conditions.'}</div>
                </div>

                <div className="glass-widget">
                  <div className="widget-header">🌡 Feels Like</div>
                  <div className="widget-value">{Math.round(data.current.main.feels_like)}°</div>
                  <div style={{ marginTop: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {data.current.main.feels_like > data.current.main.temp ? 'Humidity is making it feel warmer.' : 'Wind is making it feel cooler.'}
                  </div>
                </div>

                <div className="glass-widget">
                  <div className="widget-header">🌬 Wind Direction</div>
                  <div className="widget-value">{data.current.wind.direction || '--'}°</div>
                  <div style={{ marginTop: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {getWindDirection(data.current.wind.direction)}
                  </div>
                </div>

                <div className="glass-widget">
                  <div className="widget-header">🌡 Pressure</div>
                  <div className="widget-value">{data.current.main.pressure || '--'} <span className="widget-unit">hPa</span></div>
                  <div style={{ marginTop: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {data.current.main.pressure > 1013 ? 'High pressure' : data.current.main.pressure < 1013 ? 'Low pressure' : 'Normal pressure'}
                  </div>
                </div>

                <div className="glass-widget">
                  <div className="widget-header">🌧 Precipitation</div>
                  <div className="widget-value">{data.current.precipitation || 0} <span className="widget-unit">mm</span></div>
                  <div style={{ marginTop: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {data.current.precipitation > 0 ? 'Currently raining' : 'No precipitation'}
                  </div>
                </div>

                <div className="glass-widget">
                  <div className="widget-header">☀️ UV Index</div>
                  <div className="widget-value">{data.daily && data.daily.uv_index_max ? data.daily.uv_index_max[0] : '--'}</div>
                  <div style={{ marginTop: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {getUVIndexLevel(data.daily && data.daily.uv_index_max ? data.daily.uv_index_max[0] : 0)}
                  </div>
                </div>

                <div className="glass-widget">
                  <div className="widget-header">📊 Weather Stats</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Humidity</div>
                      <div style={{ fontSize: '18px', fontWeight: '500' }}>{data.current.main.humidity}%</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Visibility</div>
                      <div style={{ fontSize: '18px', fontWeight: '500' }}>{data.current.visibility ? Math.round(data.current.visibility / 1000) : 10}km</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Wind</div>
                      <div style={{ fontSize: '18px', fontWeight: '500' }}>{data.current.wind.speed}m/s</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div style={{ margin: 'auto' }}>No weather data available. Please search for a city.</div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
