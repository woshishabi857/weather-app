const fs = require('fs');
fs.writeFileSync('debug.log', 'Starting debug...\n');
try {
  fs.appendFileSync('debug.log', '1. Express\n');
  require('express');
  fs.appendFileSync('debug.log', '2. Dotenv\n');
  require('dotenv').config();
  fs.appendFileSync('debug.log', '3. Cors\n');
  require('cors');
  fs.appendFileSync('debug.log', '4. Database\n');
  require('./database.js');
  fs.appendFileSync('debug.log', '5. Locations Route\n');
  require('./routes/locations.js');
  fs.appendFileSync('debug.log', '6. Weather Route\n');
  require('./routes/weather.js');
  fs.appendFileSync('debug.log', '7. Done requiring routes\n');
} catch (e) {
  fs.appendFileSync('debug.log', 'ERROR: ' + e.message + '\n');
}
