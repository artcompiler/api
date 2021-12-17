const { expect } = require('chai');
const { postTasks, getTasks } = require('./task');
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
  describe('postTasks task', () => {
    it('mapping a task to an ID', async () => {
      expect(
        await postTasks(auth, [task])
      ).to.eql([taskID]);
    });
  });
  describe('getTasks ID', () => {
    it('mapping a task to an ID', async () => {
      expect(
        await getTasks(auth, taskID)
      ).to.eql([task]);
    });
  });
  describe('postTasks [task*]', () => {
    it('mapping tasks to an IDs', async () => {
      expect(
        await postTasks(auth, [task, task2])
      ).to.eql([taskID, taskID2]);
    });
  });
  describe('getTasks [ID*]', () => {
    it('mapping IDs to tasks', async () => {
      expect(
        await getTasks(auth, [taskID, taskID2])
      ).to.eql([task, task2]);
    });
  });
});
