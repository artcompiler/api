const { decodeID, encodeID } = require('./id');

const nilID = encodeID([0, 0, 0]);

const getLang = ids => `L${ids[0]}`;

const buildGetCode = ({ taskDaoFactory }) => async (ids) => {
  const taskDao = taskDaoFactory.create();

  const [langId, codeId] = ids;
  const taskId = encodeID([langId, codeId, 0]);

  const task = await taskDao.findById(taskId);

  return task.code;
};

const buildGetData = ({ taskDaoFactory }) => async (ids) => {
  if (encodeID(ids) === nilID) {
    return {};
  }

  if (ids.length === 3 && ids[2] === 0) {
    return {};
  }

  const dataIds = ids.slice(2);
  if (dataIds.length !== 3) {
    throw new Error(`expected dataIds to have length 3, got ${data} `)
  }

  const [dataLangId, dataCodeId] = dataIds;
  if (dataLangId !== 113) {
    throw new Error(`expected data langId to be 113, but got ${dataLangId}`);
  }

  const taskDao = taskDaoFactory.create();
  const taskId = encodeID([dataLangId, dataCodeId, 0]);
  const task = await taskDao.findById(taskId);
  return task.code;
};

const buildCompileId = ({ taskDaoFactory, cache, langCompile }) => {
  const getCode = buildGetCode({ taskDaoFactory });
  const getData = buildGetData({ taskDaoFactory });
  return async (auth, id, options) => {
    const { refresh = false, dontSave = false } = options || {};

    if (id === nilID) {
      const data = {};
      return data;
    }

    if (refresh) {
      await cache.del(id, 'data');
    }

    let obj = await cache.get(id, 'data');
    if (obj) {
      return obj;
    }

    const ids = decodeID(id);
    let [lang, code, data] = await Promise.all([
      getLang(ids), getCode(ids), getData(ids)
    ]);
    obj = await langCompile(lang, { auth, code, data, options });

    if (!dontSave) {
      await cache.set(id, 'data');
    }

    return obj;
  };
};

exports.buildCompileId = buildCompileId;
