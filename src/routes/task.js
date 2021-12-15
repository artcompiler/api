const assert = require('assert');
const {Router} = require('express');
const {getTask, postTask} = require('../task');
const {error, statusCodeFromErrors, messageFromErrors, setMetadataBuilds} = require('../util');
const build = require('../../build.json');
module.exports = () => {
  const router = new Router();
  router.get('/', async (req, res) => {
    try {
      const auth = req.query.auth;
      const id = req.query.id;
      error(id !== undefined, "Missing task in GET /task.");
      const t0 = new Date;
      console.log("GET /task id=" + JSON.stringify(id));
      const task = getTask(id);
      console.log("GET /task task=" + JSON.stringify(task));
      console.log("GET /compile in " + (new Date - t0) + "ms");
      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).json(task);
    } catch(err) {
      res.status(500).json(err.message);
    }
  });
  router.options('/', async (req, res) => {
    try {
      console.log("OPTIONS /compile body=" + JSON.stringify(req.body, null, 2));
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
    // POST /task {task} => {id}
    try {
      const body = typeof req.body === "string" && JSON.parse(req.body) || req.body;
      const task = body.task;
      const auth = body.auth;
      error(task, "Missing task in POST /task.");
      error(!isNaN(parseInt(task.lang)), "Invalid language identifier in POST /task data.");
      error(task.code, "Invalid code in POST /task data.");
      const t0 = new Date;
      console.log("POST /task task=" + JSON.stringify(task));
      const id = postTask(task);
      console.log("POST /task id=" + JSON.stringify(id));
      console.log("POST /task in " + (new Date - t0) + "ms");
      const statusCode = id === null && 400 || 200;
      const val = {id: id};
      setMetadataBuilds(val, build);
      res.set("Access-Control-Allow-Origin", "*");
      res.status(statusCode).json(val);
    } catch(err) {
      console.log("POST /task err=" + err);
      res.status(400).json({
        error: messageFromErrors(err)
      });
    }
  });
  return router;
};
