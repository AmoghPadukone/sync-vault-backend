import request from 'supertest';
import app from '../src/app';

describe('Search API', () => {
  it('should respond to /example', async () => {
    const res = await request(app).get('/api/search/example');
    expect(res.statusCode).toBe(200);
  });
});

