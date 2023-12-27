import log from '../BaseClient/ClientHelperModules/logError.js';

export default (info: Error) => {
 log(info, true);
};
