const request = require('supertest');
const app = require('../src/index');

describe('Stocks API', () => {
  it('should fetch stock data', async () => {
    const res = await request(app).get('/api/stocks/RELIANCE.NS/history');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
