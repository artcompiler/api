const { Router } = require('express');
const {
  buildHttpHandler,
  createErrorResponse,
  createSuccessResponse,
  parseIdsFromRequest,
  parseAuthFromRequest,
  optionsHandler,
} = require('./utils');

const getDataFromData = (data) => {
  // If there is just one object in data, then return it.
  return data.length === 1 && data[0] || data;
}

const buildGetDataHandler = ({ dataApi }) => buildHttpHandler(async (req, res) => {
  const auth = parseAuthFromRequest(req);
  const ids = parseIdsFromRequest(req);
  if (ids.length < 1) {
    res.status(400).json(createErrorResponse('must provide at least one id'));
    return;
  }
  const data = getDataFromData(await dataApi.get(auth, ids));
  res.set("Access-Control-Allow-Origin", "*");
  res.status(200).json(createSuccessResponse(data));
});

module.exports = ({ dataApi }) => {
  const router = new Router();
  router.get('/', buildGetDataHandler({ dataApi }));
  router.options('/', optionsHandler);
  return router;
};
