import log from '../../BaseClient/UtilModules/logError.js';

export default (id: number) => {
 log(`[Shard ${id + 1}] Reconnecting...`, true);
};
