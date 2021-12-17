const assert = require('assert');
const {compileID} = require('./comp');


async function getData(auth, ids) {
  if (!(ids instanceof Array)) {
    ids = [ids];
  }
  return Promise.all(ids.map(async (id) => {
    return await getDatum(auth, id);
  }));
}

async function getDatum(auth, id) {
  return new Promise((accept, reject) => {
    compileID(auth, id, {}, (err, obj) => {
      if (err) {
        reject(err);
      } else {
        accept(obj);
      }
    });
  });
}

exports.getData = getData;
