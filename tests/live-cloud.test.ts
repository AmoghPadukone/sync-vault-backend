import request from 'supertest';
import app from '../src/app';

describe('Live-cloud API', () => {
  it('should respond to /example', async () => {
    const res = await request(app).get('/api/live-cloud/example');
    expect(res.statusCode).toBe(200);
  });
});

