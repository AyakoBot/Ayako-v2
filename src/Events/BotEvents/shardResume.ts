import log from '../../BaseClient/UtilModules/logError.js';

export default (id: number, replayed: number) => {
 log(`[Shard ${id + 1}] Resuming - Replayed Events: ${replayed}`, true);
};
