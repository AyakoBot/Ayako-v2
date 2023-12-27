import log from '../BaseClient/ClientHelperModules/logError.js';

const debugEnabled = process.argv.includes('--debug');

export default (message: string) => {
 if (message.includes('Heartbeat')) {
  log(message);
  return;
 }

 if (!debugEnabled) {
  log(message);
  return;
 }

 log(message, true);
};
