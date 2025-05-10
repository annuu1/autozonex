const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const Zone = require('../src/models/Zone');

describe('Zones API', () => {
  beforeAll(async () => {
    await Zone.deleteMany({}); // Clear DB before tests
  });

  it('should identify demand zones with daily timeFrame', async () => {
    const res = await request(app).get('/api/zones/RELIANCE.NS/1d');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('ticker', 'RELIANCE.NS');
      expect(res.body[0]).toHaveProperty('type', 'demand');
      expect(res.body[0]).toHaveProperty('tradeScore');
      expect(res.body[0]).toHaveProperty('legOutDate');
      expect(res.body[0].pattern).toMatch(/DBR|RBR/);
    }
  });

  it('should identify demand zones with weekly timeFrame', async () => {
    const res = await request(app).get('/api/zones/RELIANCE.NS/1wk');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should identify demand zones without timeFrame', async () => {
    const res = await request(app).get('/api/zones/RELIANCE.NS');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should return error for invalid ticker', async () => {
    const res = await request(app).get('/api/zones/INVALID_TICKER/1d');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid ticker format. Use NSE/BSE ticker (e.g., RELIANCE.NS)');
  });

  it('should return error for invalid timeFrame', async () => {
    const res = await request(app).get('/api/zones/RELIANCE.NS/invalid');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid timeFrame. Use 1d, 1wk, or 1mo.');
  });
});