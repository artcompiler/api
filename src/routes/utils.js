const { isNonEmptyString } = require('../util');

exports.parseIdsFromRequest = req => {
  const id = req.query.id;
  if (isNonEmptyString(id)) {
    return id.split(',');
  }
  return [];
};

exports.parseAuthFromRequest = req => {
  const { auth: queryAuth } = req.query;
  if (isNonEmptyString(queryAuth)) {
    return queryAuth;
  }
  const { auth: bodyAuth } = req.body;
  if (isNonEmptyString(bodyAuth)) {
    return bodyAuth;
  }
  return null;
};

exports.buildHttpHandler = handler => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (err) {
    next(err);
  }
};

const createError = (code, message) => ({ code, message });

exports.createErrorResponse = error => ({
  status: 'error',
  error: createError(1, error),
  data: null,
});

exports.createSuccessResponse = data => ({
  status: 'success',
  error: null,
  data,
});