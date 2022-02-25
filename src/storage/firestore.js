const { createHash } = require('crypto');
const { initializeApp } = require('@firebase/app');
const {
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
  increment,
  runTransaction,
  updateDoc,
} = require('@firebase/firestore');
const { encodeID, decodeID } = require('../id');
const { NotFoundError } = require('./errors');

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

const createCodeHash = code =>
  createHash('sha256')
    .update(JSON.stringify(code))
    .digest('hex');

const buildTaskCreate = ({ db }) => async (task) => {
  const { lang, code } = task;
  const codeHash = createCodeHash(task.code);

  const langId = Number.parseInt(task.lang);
  const { codeId } = await runTransaction(db, async (t) => {
    const taskIdRef = doc(db, 'task-ids', codeHash);
    const taskIdDoc = await t.get(taskIdRef);
    if (taskIdDoc.exists()) {
      const codeId = taskIdDoc.get('codeId');
      return { codeId, exists: true };
    }

    const tasksCountersRef = doc(db, 'counters', 'tasks');
    const tasksCountersDoc = await t.get(tasksCountersRef);
    if (!tasksCountersDoc.exists()) {
      throw new Error(`tasks counters do not exist, does the db need to be initialized?`);
    }
    const codeId = tasksCountersDoc.get('nextCodeId');

    t.update(tasksCountersRef, { nextCodeId: increment(1) });
    t.set(taskIdRef, { codeId, count: 0 });

    const taskRef = doc(db, 'tasks', codeId.toString());
    t.set(taskRef, { lang, code, codeHash });

    return { codeId, exists: false }
  });

  const taskRef = doc(db, 'tasks', codeId.toString());
  await updateDoc(taskRef, { count: increment(1) });

  return encodeID([langId, codeId, 0]);
};

const buildTaskFindById = ({ db }) => async (id) => {
  const [langId, codeId] = decodeID(id);
  const taskRef = doc(db, 'tasks', codeId.toString());
  const taskDoc = await getDoc(taskRef);
  if (!taskDoc.exists()) {
    throw new NotFoundError();
  }
  const lang = taskDoc.get('lang');
  const code = taskDoc.get('code');
  return { lang, code };
};

const buildFirestoreTaskDao = ({ dev = false }) => {
  const app = initializeApp(options);
  const db = getFirestore(app);

  const create = buildTaskCreate({ db });
  const findById = buildTaskFindById({ db });
  return { create, findById };
};
exports.buildFirestoreTaskDao = buildFirestoreTaskDao;
