const request = require('supertest');
const { createApp } = require('../app');
const { TASK1, TASK_ID1, DATA1, DATA2, TASK_ID2, TASK2 } = require('../testing/fixture');
const { createSuccessResponse } = require('./utils');

describe('/data endpoint', () => {
  let app;
  beforeEach(() => {
    app = createApp();
  });

  it('get single data', async () => {
    await request(app).post('/task').send({ task: TASK1 });
    await request(app)
      .get(`/data?id=${[TASK_ID1].join(',')}`)
      .expect(200, createSuccessResponse(DATA1));
  });

  it('get multiple datas', async () => {
    await request(app).post('/task').send({ task: TASK1 });
    await request(app).post('/task').send({ task: TASK2 });
    await request(app)
      .get(`/data?id=${[TASK_ID1, TASK_ID2].join(',')}`)
      .expect(200, createSuccessResponse([DATA1, DATA2]));
  });
});
