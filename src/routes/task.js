const { Router } = require('express');
const {
  buildHttpHandler,
  createErrorResponse,
  createSuccessResponse,
  parseIdsFromRequest,
} = require('./utils');

const buildGetTaskHandler = ({ taskDaoFactory }) => buildHttpHandler(async (req, res) => {
  const ids = parseIdsFromRequest(req);
  if (ids.length < 1) {
    res.status(400).json(createErrorResponse('must provide at least one id'));
    return;
  }
  const taskDao = taskDaoFactory.create({});
  const tasks = await Promise.all(ids.map(id => taskDao.findById(id)));
  res.status(200).json(createSuccessResponse(tasks));
});

const buildPostTaskHandler = ({ taskDaoFactory }) => buildHttpHandler(async (req, res) => {
  console.log("POST /task task=" + JSON.stringify(req.body.task, null, 2));
  const taskDao = taskDaoFactory.create({});
  let id = await taskDao.create(req.body.task);
  id = id.length === 1 && id[0] || id;
  console.log("POST /task => id=" + JSON.stringify(id));
  res.status(200).json(createSuccessResponse({ id }));
});

const optionsTaskHandler = buildHttpHandler(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Request-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type");
    res.set("Connection", "Keep-Alive");
    res.sendStatus(204);
  } catch (err) {
    console.log("OPTIONS /task err=" + err);
    res.statusStatus(500);
  }
});

module.exports = ({ taskDaoFactory }) => {
  const router = new Router();
  router.options('/', optionsTaskHandler),
  router.get('/', buildGetTaskHandler({ taskDaoFactory }));
  router.post('/', buildPostTaskHandler({ taskDaoFactory }));
  return router;
};
