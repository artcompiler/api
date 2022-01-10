const { Router } = require('express');
const {
  buildHttpHandler,
  createErrorResponse,
  parseIdsFromRequest,
  createSuccessResponse,
  parseAuthFromRequest,
} = require('./utils');

const buildGetDataHandler = ({ dataApi }) => buildHttpHandler(async (req, res) => {
  const auth = parseAuthFromRequest(req);
  const ids = parseIdsFromRequest(req);
  if (ids.length < 1) {
    res.status(400).json(createErrorResponse('must provide at least one id'));
    return;
  }
  const data = await dataApi.get(auth, ids);
  res.status(200).json(createSuccessResponse(data));
});

module.exports = ({ dataApi }) => {
  const router = new Router();
  router.get('/', buildGetDataHandler({ dataApi }));
  return router;
};
