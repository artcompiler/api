const assert = require('assert');
const {decodeID, encodeID, objectToID, objectFromID} = require('./id');
const {compileID} = require('./comp');
const nilID = encodeID([0,0,0]);

function verifyCode(code) {
  // Return code if valid, otherwise return null.
  if (code.root) {
    return code;
  } else {
    return null;
  }
}

function taskToID(task) {
  // task = {lang, code}
  // where
  //   lang is an integer language identifier,
  //   code is an AST which may or may not be in the AST store, and
  try {
    let langID = task.lang;
    let codeID = objectToID(verifyCode(task.code));
    let id = encodeID([langID, codeID, 0]);
    return id;
  } catch (err) {
    return err;
  }
}

function taskFromID(id) {
  // task = {lang, code}
  // where
  //   lang is an integer language identifier,
  //   code is an AST which may or may not be in the AST store, and
  try {
    const ids = decodeID(id);
    const lang = String(ids[0]);
    const code = objectFromID(ids[1]);
    const task = {lang: lang, code: code};
    return task;
  } catch (err) {
    return err;
  }
}

async function postTasks(auth, tasks) {
  tasks = [].concat(tasks);
  return Promise.all(tasks.map((task) => {
    return postTask(auth, task);
  }));
}

async function postTask(auth, task) {
  let id = taskToID(task);
  compileID(auth, id, {}, () => {});  // Prime the cache.
  return id;
}

async function getTask(id) {
  let task;
  if (id instanceof Array) {
    const tasks = [];
    id.forEach(async (id) => {
      tasks.push(await getTask(id));
    });
    task = tasks;
  } else {
    task = taskFromID(id);
  }
  return task;
}

exports.postTask = postTask;
exports.postTasks = postTasks;
exports.getTask = getTask;
