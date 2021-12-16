const assert = require('assert');
const {compileID} = require('./comp');

async function getData(auth, id) {
  return new Promise(async (accept, reject) => {
    let data;
    if (id instanceof Array) {
      try {
        const data = [];
        for (var i = 0; i < id.length; i++) {
          data.push(await getData(auth, id[i]));
        };
        accept(data);
      } catch (err) {
        reject(err);
      }
    } else {
      compileID(auth, id, {}, (err, obj) => {
        if (err) {
          reject(err);
        } else {
          accept(obj);
        }
      });
    }
  });
}

exports.getData = getData;
