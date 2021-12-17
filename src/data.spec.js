const { expect } = require('chai');
const { postTask, postTasks } = require('./task');
const { getData } = require('./data');
const auth = null;
describe('data', () => {
  const task = {
    lang: "0",
    code: {
      "1":{"tag":"STR","elts":["hello, world!"]},
      "2":{"tag":"EXPRS","elts":[1]},
      "3":{"tag":"PROG","elts":[2]},
      "root":3,
      "version":"1"}
  };
  const task2 = {
    lang: "0",
    code: {
      "1":{"tag":"STR","elts":["goodbye, world!"]},
      "2":{"tag":"EXPRS","elts":[1]},
      "3":{"tag":"PROG","elts":[2]},
      "root":3,
      "version":"1"}
  };
  const taskID = 'yLimC0';
  const taskID2 = 'WaiqIp';
  const data = 'hello, world!';
  const data2 = 'goodbye, world!';
  
  describe('postTask task', () => {
    it('mapping a task to an ID', async () => {
      expect(
        await postTask(auth, task)
      ).to.eql(taskID);
    });
  });
  describe('getData ID', () => {
    it('mapping a task to data', async () => {
      expect(
        await getData(auth, taskID)
      ).to.equal(data);
    });
  });
  describe('postTask [task*]', () => {
    it('mapping tasks to an IDs', async () => {
      expect(
        await postTasks(auth, [task, task2])
      ).to.eql([taskID, taskID2]);
    });
  });
  describe('getData [ID*]', () => {
    it('mapping IDs to data', async () => {
      expect(
        await getData(auth, [taskID, taskID2])
      ).to.eql([data, data2]);
    });
  });
});
