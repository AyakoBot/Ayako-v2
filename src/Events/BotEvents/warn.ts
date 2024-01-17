import log from '../../BaseClient/UtilModules/logError.js';

const warnEnabled = process.argv.includes('--warn');

export default (message: string) => {
 if (!warnEnabled) {
  log(message, false);
  return;
 }

 log(message, true);
};
