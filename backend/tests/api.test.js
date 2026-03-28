const request = require('supertest');
const express = require('express');
const locationRoutes = require('../routes/locations');
const weatherRoutes = require('../routes/weather');
const db = require('../database');

const app = express();
app.use(express.json());
app.use('/api/locations', locationRoutes);
app.use('/api/weather', weatherRoutes);

describe('Weather App API', () => {
  let createdLocationId;
  
  it('should create a new location', async () => {
    const res = await request(app)
      .post('/api/locations')
      .send({ name: 'Test City', lat: 40.7128, lon: -74.006 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test City');
    createdLocationId = res.body.id;
  });

  it('should fetch all locations', async () => {
    const res = await request(app).get('/api/locations');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should update a location', async () => {
    const res = await request(app)
      .put(`/api/locations/${createdLocationId}`)
      .send({ name: 'Updated City', lat: 41, lon: -75 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated City');
  });

  it('should return mock weather data without real api key', async () => {
    // Tests the weather endpoint using mock logic
    const res = await request(app).get('/api/weather?city=London');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('weather');
    expect(res.body).toHaveProperty('mock', true);
  });

  it('should delete a location', async () => {
    const res = await request(app).delete(`/api/locations/${createdLocationId}`);
    expect(res.statusCode).toEqual(200);
  });
});

// Close database handle after all tests have completed
afterAll((done) => {
  db.close(done);
});
