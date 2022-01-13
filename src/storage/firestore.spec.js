const { initializeApp } = require('@firebase/app');
const {
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
  increment,
  runTransaction,
  updateDoc,
  setDoc,
} = require('@firebase/firestore');
const { buildFirestoreTaskDao } = require('./firestore');
const { TASK1, TASK_ID1, TASK2 } = require('../testing/fixture');


describe('storage/firestore', () => {
  beforeAll(() => {
    const options = {
      apiKey: "AIzaSyAoVuUNi8ElnS7cn6wc3D8XExML-URLw0I",
      authDomain: "graffiticode.firebaseapp.com",
      databaseURL: "https://graffiticode.firebaseio.com",
      projectId: "graffiticode",
      storageBucket: "graffiticode.appspot.com",
      messagingSenderId: "656973052505",
      appId: "1:656973052505:web:3da573b30bd907829c8f48",
      measurementId: "G-G4GH7JL7GM",
    };
    const app = initializeApp(options);
    const db = getFirestore(app);
    connectFirestoreEmulator(db, 'localhost', 8080);
    setDoc(doc(db, 'counters', 'tasks'), { nextCodeId: 0 });
  });

  let taskDao;
  beforeEach(() => {
    taskDao = buildFirestoreTaskDao({ dev: true });
  });

  it('should throw NotFoundError if task is not created', async () => {
    await expect(taskDao.findById(TASK_ID1)).rejects.toThrow();
  });

  it('should create task', async () => {
    const id = await taskDao.create(TASK1);

    await expect(taskDao.findById(id)).resolves.toStrictEqual(TASK1);
  });

  it('should create tasks', async () => {
    const id1 = await taskDao.create(TASK1);
    const id2 = await taskDao.create(TASK2);

    await expect(taskDao.findById(id1)).resolves.toStrictEqual(TASK1);
    await expect(taskDao.findById(id2)).resolves.toStrictEqual(TASK2);
  });
});