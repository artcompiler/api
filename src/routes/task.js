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
  const taskDao = taskDaoFactory.create({});
  const id = await taskDao.create(req.body.task);
  res.status(200).json(createSuccessResponse({ id }));
});

module.exports = ({ taskDaoFactory }) => {
  const router = new Router();
  router.get('/', buildGetTaskHandler({ taskDaoFactory }));
  router.post('/', buildPostTaskHandler({ taskDaoFactory }));
  return router;
};
