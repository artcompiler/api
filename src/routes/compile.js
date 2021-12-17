const assert = require('assert');
const {Router} = require('express');
const {compile} = require('../comp');
const {error, statusCodeFromErrors, messageFromErrors, setMetadataBuilds} = require('../util');
const build = require('../../build.json');
module.exports = () => {
  const router = new Router();
  router.get('/', async (req, res) => {
    try {
      let body = typeof req.body === "string" && JSON.parse(req.body) || req.body;
      let item = body.item;
      let auth = body.auth;
      error(item, "Missing item in POST /compile.");
      error(!isNaN(parseInt(item.lang)), "Invalid language identifier in POST /compile data.");
      error(item.code, "Invalid code in POST /compile data.");
      let val = await compile(auth, item);
      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).json(val);
    } catch(err) {
      res.status(500).json(err.message);
    }
  });
  router.options('/', async (req, res) => {
    try {
      let body = typeof req.body === "string" && JSON.parse(req.body) || req.body;
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Request-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type");
      res.set("Connection", "Keep-Alive");
      res.sendStatus(204);
    } catch(err) {
      console.log("OPTIONS /compile err=" + err);
      res.statusStatus(500);
    }
  });
  router.post('/', async (req, res) => {
    try {
      let body = typeof req.body === "string" && JSON.parse(req.body) || req.body;
      let item = body.item;
      let auth = body.auth;
      error(item, "Missing item in POST /compile.");
      error(!isNaN(parseInt(item.lang)), "Invalid language identifier in POST /compile data.");
      error(item.code, "Invalid code in POST /compile data.");
      let val = await compile(auth, item);
      let refresh = item.options && item.options.refresh;
      const statusCode = val.error && 400 || 200;
      setMetadataBuilds(val, build);
      res.set("Access-Control-Allow-Origin", "*");
      res.status(statusCode).json(val);
    } catch(err) {
      console.log("POST /compile err=" + err);
      res.status(400).json({
        error: messageFromErrors(err)
      });
    }
  });
  return router;
};
