const { buildDataApi } = require('./data');
const { TASK_ID1, DATA1, TASK_ID2, DATA2 } = require('./testing/fixture');

describe('data', () => {
  let compileId;
  let dataApi;
  beforeEach(() => {
    compileId = jest.fn();
    dataApi = buildDataApi({ compileId });
  });

  const mockCompileIdData = data =>
    compileId.mockResolvedValueOnce(data);

  it('should compile a created task', async () => {
    const auth = 'abc';
    mockCompileIdData(DATA1);
    const options = null;

    await expect(dataApi.get(auth, [TASK_ID1], options)).resolves.toStrictEqual([DATA1]);

    expect(compileId).toHaveBeenCalledTimes(1);
    expect(compileId).toHaveBeenNthCalledWith(1, auth, TASK_ID1, null);
  });

  it('should compile created tasks', async () => {
    const auth = 'abc';
    mockCompileIdData(DATA1);
    mockCompileIdData(DATA2);
    const options = null;

    await expect(dataApi.get(auth, [TASK_ID1, TASK_ID2], options)).resolves.toStrictEqual([DATA1, DATA2]);

    expect(compileId).toHaveBeenCalledTimes(2);
    expect(compileId).toHaveBeenNthCalledWith(1, auth, TASK_ID1, null);
    expect(compileId).toHaveBeenNthCalledWith(2, auth, TASK_ID2, null);
  });
});
