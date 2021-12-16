const assert = require('assert');
const {Router} = require('express');
const {getData} = require('../data');
const {error, statusCodeFromErrors, messageFromErrors, setMetadataBuilds} = require('../util');
const build = require('../../build.json');

module.exports = () => {
  const router = new Router();
  router.get('/', async (req, res) => {
    try {
      const id = req.query.id;
      const auth = '';
      id = id.indexOf(',') < 0 && id || id.split(',');
      error(id !== undefined, "Missing task in GET /data.");
      let t0 = new Date;
      const data = await getData(auth, id);
      const val = {data: data};
      setMetadataBuilds(val, build);
      res.status(200).json(val);
    } catch(err) {
      res.status(500).json(err.message);
    }
  });
  
  router.options('/', async (req, res) => {
    try {
      console.log("OPTIONS /data?id=" + req.query.id);
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Request-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type");
      res.set("Connection", "Keep-Alive");
      res.sendStatus(204);
    } catch(err) {
      console.log("OPTIONS /data err=" + err);
      res.statusStatus(500);
    }
  });
  return router;
};
