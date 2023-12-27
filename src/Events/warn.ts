import log from '../BaseClient/ClientHelperModules/logError.js';

const warnEnabled = process.argv.includes('--warn');

export default (message: string) => {
 if (!warnEnabled) {
  log(message);
  return;
 }

 log(message, true);
};
