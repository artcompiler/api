const { Router } = require('express');
const { getTasks, postTasks } = require('../task');
const { error, messageFromErrors, setMetadataBuilds } = require('../util');
const build = require('../../build.json');

module.exports = () => {
  const router = new Router();
  router.get('/', async (req, res) => {
    // GET /task?id=id => {task}
    try {
      const auth = req.query.auth;
      const id = req.query.id;
      id = id.indexOf(',') < 0 && id || id.split(',');
      error(id !== undefined, "Missing task in GET /task.");
      const task = await getTasks(auth, id);
      task = task.length === 1 && task[0] || task;
      setMetadataBuilds(task, build);
      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).json(task);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });

  router.options('/', async (req, res) => {
    try {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Request-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type");
      res.set("Connection", "Keep-Alive");
      res.sendStatus(204);
    } catch (err) {
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
      const id = await postTasks(auth, task);
      id = id.length === 1 && id[0] || id;
      const val = { id: id };
      setMetadataBuilds(val, build);
      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).json(val);
    } catch (err) {
      console.log("POST /task err=" + err);
      res.status(400).json({
        error: messageFromErrors(err)
      });
    }
  });
  return router;
};
