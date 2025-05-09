import request from 'supertest';
import app from '../src/app';

describe('Share API', () => {
  it('should respond to /example', async () => {
    const res = await request(app).get('/api/share/example');
    expect(res.statusCode).toBe(200);
  });
});

