import log from '../../BaseClient/UtilModules/logError.js';

export default (event: CloseEvent, id: number) => {
 log(`[Shard ${id + 1}] Disconnected - ${event.reason}`, true);
};
