const buildGetDatum = ({ compileId }) => (auth, id, options) => compileId(auth, id, options);
const buildGetData = ({ getDatum }) => (auth, ids, options) => Promise.all(ids.map(id => getDatum(auth, id, options)));

const buildDataApi = ({ compileId }) => {
  const getDatum = buildGetDatum({ compileId });
  const getData = buildGetData({ getDatum });
  return { get: getData };
};
exports.buildDataApi = buildDataApi;
