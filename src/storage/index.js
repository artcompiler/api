
const buildCreate = ({ cache }) => ({ type = 'memory' } = {}) => {
  if (!cache.has(type)) {
    let taskDao;
    if (type === 'memory') {
      const { buildMemoryTaskDao } = require('./memory');
      // FIXME handle array of tasks here.
      taskDao = buildMemoryTaskDao();
    } else {
      throw new Error(`no TaskDao with type ${type}`);
    }
    cache.set(type, taskDao);
  }
  return cache.get(type);
};

const buildTaskDaoFactory = () => {
  const cache = new Map();
  const create = buildCreate({ cache });
  return { create };
};
exports.buildTaskDaoFactory = buildTaskDaoFactory;
