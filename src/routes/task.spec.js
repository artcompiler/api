const request = require('supertest');
const app = require('../app');
describe('/task endpoint', () => {
  const task = {
    lang: "0",
    code: {
      "1": { "tag": "STR", "elts": ["hello, world!"] },
      "2": { "tag": "EXPRS", "elts": [1] },
      "3": { "tag": "PROG", "elts": [2] },
      "root": 3,
      "version": "1"
    }
  };
  const task2 = {
    lang: "0",
    code: {
      "1": { "tag": "STR", "elts": ["goodbye, world!"] },
      "2": { "tag": "EXPRS", "elts": [1] },
      "3": { "tag": "PROG", "elts": [2] },
      "root": 3,
      "version": "1"
    }
  };
  const taskID = 'yLimC0';
  const taskID2 = 'WaiqIp';
  it('POST /task', (done) => {
    request(app)
      .post('/task')
      .send({ task: task })
      .expect((res) => {
        delete res.body._;
      })
      .expect(200, { id: taskID }, done);
  });
  it('GET /task', (done) => {
    request(app)
      .get('/task?id=' + taskID)
      .expect((res) => {
        delete res.body._;
      })
      .expect(200, task, done);
  });
  it('POST /task', (done) => {
    request(app)
      .post('/task')
      .send({ task: [task, task2] })
      .expect((res) => {
        delete res.body._;
      })
      .expect(200, { id: [taskID, taskID2] }, done);
  });
  it('GET /task?id=[]', (done) => {
    request(app)
      .get('/task?id=' + [taskID, taskID2])
      .expect((res) => {
        delete res.body._;
      })
      .expect(200, [task, task2], done);
  });
});
