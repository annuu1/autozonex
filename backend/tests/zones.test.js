const request = require('supertest');
const app = require('../src/index');
const Zone = require('../src/models/Zone');

describe('Zones API', () => {
  beforeAll(async () => {
    await Zone.deleteMany({}); // Clear DB before tests
  });

  it('should identify demand zones for a valid ticker', async () => {
    const res = await request(app).get('/api/zones/RELIANCE.NS/1d');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('ticker', 'RELIANCE.NS');
      expect(res.body[0]).toHaveProperty('type', 'demand');
      expect(res.body[0]).toHaveProperty('tradeScore');
      expect(res.body[0]).toHaveProperty('pattern', expect.anyOf('DBR', 'RBR'));
    }
  });

  it('should return error for invalid ticker', async () => {
    const res = await request(app).get('/api/zones/INVALID_TICKER/1d');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message');
  });
});