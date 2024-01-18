import log from '../../BaseClient/UtilModules/logError.js';

export default (warning: Error) => {
 log(`[Warning] ${warning.message}`, true);
 if (warning.stack) log(warning.stack, true);
};
