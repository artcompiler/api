const request = require('supertest');
const { createApp } = require('../app');
const { TASK1, DATA1 } = require('../testing/fixture');
const { createSuccessResponse } = require('./utils');

describe('routes/compile', () => {
  let app;
  beforeEach(() => {
    app = createApp();
  });

  it('should compile source', async () => {
    await request(app)
      .post('/compile')
      .send({ item: TASK1 })
      .expect(200, createSuccessResponse(DATA1));
  });

  it('should compile source with data', async () => {
    await request(app)
      .post('/compile')
      .send({ item: { ...TASK1, data: { foo: 'bar' } } })
      .expect(200, createSuccessResponse(DATA1));
  });
});