const request = require('supertest');
const { createApp } = require('./app');

describe('api', () => {
  let app;
  beforeEach(() => {
    app = createApp();
  });

  it('GET /', (done) => {
    request(app)
      .get('/')
      .expect(200, 'OK', done);
  });
});
