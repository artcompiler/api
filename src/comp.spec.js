const { buildLocalCache } = require('./cache');
const { buildCompileId } = require('./comp');
const { buildTaskDaoFactory } = require('./storage');
const { TASK_ID1, DATA1, TASK1 } = require('./testing/fixture');

describe('comp', () => {
  describe('compileId', () => {
    let taskDaoFactory;
    let langCompile;
    let compileId;
    beforeEach(() => {
      taskDaoFactory = buildTaskDaoFactory();
      const cache = buildLocalCache({});
      langCompile = jest.fn();
      compileId = buildCompileId({ taskDaoFactory, cache, langCompile });
    });

    it('should compile single ID', async () => {
      const taskDao = taskDaoFactory.create();
      await taskDao.create(TASK1);
      langCompile.mockResolvedValue(DATA1);

      await expect(compileId(null, TASK_ID1, null)).resolves.toBe(DATA1);

      expect(langCompile).toHaveBeenCalledWith('L0', { auth: null, code: TASK1.code, data: {}, options: null });
    });
  });
});
