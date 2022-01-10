const request = require('supertest');
const { createApp } = require('../app');
const { TASK1, TASK2, TASK_ID1, TASK_ID2 } = require('../testing/fixture');
const { createSuccessResponse, createErrorResponse } = require('./utils');

describe('/task endpoint', () => {
  let app;
  beforeEach(() => {
    app = createApp();
  });

  it('POST /task', async () => {
    await request(app)
      .post('/task')
      .send({ task: TASK1 })
      .expect(200, createSuccessResponse({ id: TASK_ID1 }));
  });

  it('GET /task no ids', async () => {
    await request(app)
      .get(`/task`)
      .expect(400, createErrorResponse('must provide at least one id'));
  });

  it('GET /task', async () => {
    await request(app).post('/task').send({ task: TASK1 });

    await request(app)
      .get(`/task?id=${[TASK_ID1].join(',')}`)
      .expect(200, createSuccessResponse([TASK1]));
  });

  it('GET /task?id=[]', async () => {
    await request(app).post('/task').send({ task: TASK1 });
    await request(app).post('/task').send({ task: TASK2 });

    await request(app)
      .get(`/task?id=${[TASK_ID1, TASK_ID2].join(',')}`)
      .expect(200, createSuccessResponse([TASK1, TASK2]));
  });
});
