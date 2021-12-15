const assert = require('assert');
const {decodeID, encodeID, objectToID, objectFromID} = require('./id');
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
    console.log("taskFromID() ids=" + ids);
    const lang = String(ids[0]);
    const code = objectFromID(ids[1]);
    console.log("taskFromID() code=" + JSON.stringify(code));
    const task = {lang: lang, code: code};
    return task;
  } catch (err) {
    return err;
  }
}

function postTask(task) {
  let id;
  if (task instanceof Array) {
    id = [];
    task.forEach((task) => {
      id.push(postTask(task));
    });
  } else {
    id = taskToID(task);
  }
  return id;
}

function getTask(id) {
  let task;
  if (id instanceof Array) {
    task = [];
    id.forEach((id) => {
      task.push(getTask(id));
    });
  } else {
    task = taskFromID(id);
  }
  return task;
}

exports.postTask = postTask;
exports.getTask = getTask;
