const { buildMemoryTaskDao } = require('./memory');

const TASK_ID = 'yLimC0';
const TASK = {
  lang: "0",
  code: {
    "1": { "tag": "STR", "elts": ["hello, world!"] },
    "2": { "tag": "EXPRS", "elts": [1] },
    "3": { "tag": "PROG", "elts": [2] },
    "root": 3,
    "version": "1"
  }
};

describe('persistence/memory', () => {
  let taskDao = null;
  beforeAll(() => {
    taskDao = buildMemoryTaskDao();
  });

  it('should throw NotFoundError if task is not created', async () => {
    await expect(taskDao.findById(TASK_ID)).rejects.toThrow();
  });

  it('should return created task', async () => {
    const id = await taskDao.create(TASK);

    await expect(taskDao.findById(id)).resolves.toStrictEqual(TASK);
  });
});