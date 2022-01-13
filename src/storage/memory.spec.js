const { buildMemoryTaskDao } = require('./memory');
const { TASK1, TASK_ID1 } = require('../testing/fixture');

describe('storage/memory', () => {
  let taskDao = null;
  beforeAll(() => {
    taskDao = buildMemoryTaskDao();
  });

  it('should throw NotFoundError if task is not created', async () => {
    await expect(taskDao.findById(TASK_ID1)).rejects.toThrow();
  });

  it('should return created task', async () => {
    const id = await taskDao.create(TASK1);

    await expect(taskDao.findById(id)).resolves.toStrictEqual(TASK1);
  });
});