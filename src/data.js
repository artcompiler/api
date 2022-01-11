const buildGetData =
      ({ compileId }) => (auth, ids, options) => Promise.all(ids.map((id) => compileId(auth, id, options)));

exports.buildDataApi = ({ compileId }) => {
  return { get: buildGetData({ compileId }) };
};
