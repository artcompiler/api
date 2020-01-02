import childProcess from 'child_process';
import path from 'path';
import { promisify } from 'util';
import logUpdate from 'log-update';

import {
  buildDisplayTextWithSpinner,
  buildPrintLines,
  delay,
  fsPromise,
  rmdirRecursive,
} from './misc';
import buildZip from './zip';

const lines = [];
const printLines = buildPrintLines({ lines, logUpdate });
const displayTextWithSpinner = buildDisplayTextWithSpinner({ lines, printLines, logUpdate });
const exec = promisify(childProcess.exec);
const zip = buildZip({ exec, path });

export {
  delay,
  displayTextWithSpinner,
  fsPromise,
  rmdirRecursive,
  zip,
};
