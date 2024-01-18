import log from '../../BaseClient/UtilModules/logError.js';

export default (error: Error, id: number) => {
 log(`[Shard ${id + 1}] Error: ${error.message}`, true);
 if (error.stack) log(error.stack, true);
};
