import request from 'supertest';
import app from '../src/app';

describe('Folders API', () => {
  it('should respond to /example', async () => {
    const res = await request(app).get('/api/folders/example');
    expect(res.statusCode).toBe(200);
  });
});

