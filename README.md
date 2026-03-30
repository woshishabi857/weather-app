# Weather App

A modern weather application with real-time weather data, interactive UI, and celestial effects.

## Features

- 🌍 **Real-time Weather Data**: Get current weather conditions, 24-hour forecast, and 15-day forecast
- 📍 **Geolocation Support**: Automatically detect user's current location
- 🌅 **Celestial Effects**: Dynamic sun/moon/stars with weather-based animations
- ☁️ **Weather Animations**: Clouds, rain, and snow effects based on weather conditions
- 💾 **Location Management**: Save and manage favorite locations
- 🎨 **Modern UI**: Glassmorphism design with smooth animations
- 📱 **Responsive Design**: Works on both desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- Vite
- CSS3 (with animations and transitions)

### Backend
- Express.js
- SQLite
- Open-Meteo API for weather data

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start the development servers**
   ```bash
   # Start backend server (runs on port 5001)
   cd backend
   npm start
   
   # Start frontend development server (runs on port 5173)
   cd ../frontend
   npm run dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Backend API
- `GET /api/weather?city={city}` - Get weather data for a city
- `GET /api/weather?lat={latitude}&lon={longitude}` - Get weather data for coordinates
- `GET /api/locations` - Get saved locations
- `POST /api/locations` - Save a new location
- `DELETE /api/locations/{id}` - Delete a saved location

## Project Structure

```
weather-app/
├── backend/
│   ├── routes/          # API routes
│   ├── tests/           # Test files
│   ├── database.js      # Database configuration
│   ├── server.js        # Express server
│   └── package.json     # Backend dependencies
├── frontend/
│   ├── src/             # Frontend source code
│   ├── index.html       # HTML entry point
│   └── package.json     # Frontend dependencies
└── README.md            # Project documentation
```

## Features in Detail

### Celestial Effects
- **Day/Night Cycle**: Sun during the day, moon and stars at night
- **Weather-based Animations**: Clouds for cloudy weather, rain for rainy weather, snow for snowy weather
- **Dynamic Intensity**: Weather effects adjust based on the severity of the weather

### Location Management
- **Current Location**: Automatically detected and displayed at the top of the location list
- **Saved Locations**: Add and remove favorite locations for quick access

### Weather Data
- **Current Conditions**: Temperature, humidity, wind speed, pressure, etc.
- **24-Hour Forecast**: Hourly temperature and weather conditions
- **15-Day Forecast**: Daily high/low temperatures and weather conditions
- **Air Quality**: AQI (Air Quality Index) data
- **UV Index**: UV radiation level

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
