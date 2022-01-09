const { Router } = require('express');

const { } = require('../comp');
const { error, messageFromErrors, setMetadataBuilds } = require('../util');
const build = require('../../build.json');
const { buildHttpHandler, parseAuthFromRequest, createSuccessResponse } = require('./utils');
const { decodeID, encodeID } = require('../id');

const buildPostCompileHandler = ({ taskDaoFactory, dataApi }) => buildHttpHandler(async (req, res) => {
  const auth = parseAuthFromRequest(req);
  const { lang, code, data, options } = req.body.item || {};

  const taskDao = taskDaoFactory.create();
  let taskId = await taskDao.create({ lang, code });

  let dataTaskId;
  if (data) {
    dataTaskId = await taskDao.create({ lang: '113', code: data });
    const [langId, codeId] = decodeID(taskId);
    const dataIds = decodeID(dataTaskId);
    taskId = encodeID([langId, codeId, ...dataIds]);
  }

  const [obj] = await dataApi.get(auth, [taskId]);

  res.status(200).json(createSuccessResponse(obj));
});

module.exports = ({ taskDaoFactory, dataApi }) => {
  const router = new Router();
  router.post('/', buildPostCompileHandler({ taskDaoFactory, dataApi }));
  // router.post('/', async (req, res) => {
  //   try {
  //     let body = typeof req.body === "string" && JSON.parse(req.body) || req.body;
  //     let item = body.item;
  //     let auth = body.auth;
  //     error(item, "Missing item in POST /compile.");
  //     error(!isNaN(parseInt(item.lang)), "Invalid language identifier in POST /compile data.");
  //     error(item.code, "Invalid code in POST /compile data.");
  //     let val = await compile(auth, item);
  //     let refresh = item.options && item.options.refresh;
  //     const statusCode = val.error && 400 || 200;
  //     setMetadataBuilds(val, build);
  //     res.set("Access-Control-Allow-Origin", "*");
  //     res.status(statusCode).json(val);
  //   } catch (err) {
  //     console.log("POST /compile err=" + err);
  //     res.status(400).json({
  //       error: messageFromErrors(err)
  //     });
  //   }
  // });
  return router;
};
