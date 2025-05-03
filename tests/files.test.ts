import request from 'supertest';
import app from '../src/app';

describe('Files API', () => {
  it('should respond to /example', async () => {
    const res = await request(app).get('/api/files/example');
    expect(res.statusCode).toBe(200);
  });
});

