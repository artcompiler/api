const { Router } = require('express');
const {
  buildHttpHandler,
  createErrorResponse,
  parseIdsFromRequest,
  createSuccessResponse,
  parseAuthFromRequest,
} = require('./utils');

const buildGetDataHandler = ({ dataApi }) => buildHttpHandler(async (req, res) => {
  console.log("GET /data ids=" + JSON.stringify(req.query.ids));
  const auth = parseAuthFromRequest(req);
  const ids = parseIdsFromRequest(req);
  if (ids.length < 1) {
    res.status(400).json(createErrorResponse('must provide at least one id'));
    return;
  }
  const data = await dataApi.get(auth, ids);
  res.status(200).json(createSuccessResponse(data));
});

const optionsDataHandler = buildHttpHandler(async (req, res) => {
  console.log("OPTIONS /data");
  try {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Request-Methods", "GET POST");
    res.set("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type");
    res.set("Connection", "Keep-Alive");
    res.sendStatus(204);
  } catch (err) {
    console.log("OPTIONS /task err=" + err);
    res.statusStatus(500);
  }
});

module.exports = ({ dataApi }) => {
  const router = new Router();
  router.options('/', optionsDataHandler),
  router.get('/', buildGetDataHandler({ dataApi }));
  return router;
};
