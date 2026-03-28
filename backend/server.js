const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const locationRoutes = require('./routes/locations');
const weatherRoutes = require('./routes/weather');
app.use('/api/locations', locationRoutes);
app.use('/api/weather', weatherRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'Weather App Backend is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
