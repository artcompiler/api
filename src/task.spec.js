const { expect } = require('chai');
const { postTask, getTask } = require('./task');
const { encodeID, objectToID } = require('./id');
const auth = null;
const TIMEOUT_DURATION = 5000;
describe('task', function() {
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
  describe('postTask task', () => {
    it('mapping a task to an ID', async () => {
      expect(
        await postTask(auth, task)
      ).to.equal(taskID);
    });
  });
  describe('getTask ID', () => {
    it('mapping a task to an ID', async () => {
      expect(
        JSON.stringify(await getTask(taskID))
      ).to.equal(JSON.stringify(task));
    });
  });
  describe('postTask [task*]', () => {
    it('mapping tasks to an IDs', () => {
      expect(
        JSON.stringify(postTask(auth, [task, task2]))
      ).to.equal(JSON.stringify([taskID, taskID2]));
    });
  });
  describe('getTask [ID*]', () => {
    it('mapping IDs to tasks', () => {
      expect(
        JSON.stringify(getTask([taskID, taskID2]))
      ).to.equal(JSON.stringify([task, task2]));
    });
  });
});
