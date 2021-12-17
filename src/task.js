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
  if (!(tasks instanceof Array)) {
    tasks = [tasks];
  }
  return Promise.all(tasks.map((task) => {
    return postTask(auth, task);
  }));
}

async function postTask(auth, task) {
  const id = taskToID(task);
  compileID(auth, id, {}, () => {});  // Prime the cache.
  return id;
}

async function getTasks(auth, ids) {
  if (!(ids instanceof Array)) {
    ids = [ids];
  }
  return Promise.all(ids.map((id) => {
    return getTask(auth, id);
  }));
}

async function getTask(auth, id) {
  return taskFromID(id);
}

exports.postTasks = postTasks;
exports.getTasks = getTasks;
