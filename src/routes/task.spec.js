const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
describe('/task endpoint', () => {
  const task = {
    lang: "0",
    code: {
      "1":{"tag":"STR","elts":["hello, world!"]},
      "2":{"tag":"EXPRS","elts":[1]},
      "3":{"tag":"PROG","elts":[2]},
      "root":3,
      "version":"1"}
  };
  const taskID = 'yLimC0';
  it('POST /task', (done) => {
    request(app)
      .post('/task')
      .send({task: task})
      .expect((res) => {
        delete res.body._;
      })
      .expect(200, {id: taskID}, done);
  });
  it('GET /task', (done) => {
    request(app)
      .get('/task?id=' + taskID)
      .expect((res) => {
        delete res.body._;
      })
      .expect(200, task, done);
  });
});
