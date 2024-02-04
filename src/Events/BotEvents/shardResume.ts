import log from '../../BaseClient/UtilModules/logError.js';
import client from '../../BaseClient/Bot/Client.js';

export default (id: number, replayed: number) => {
 log(`[Shard ${id + 1}] Resuming - Replayed Events: ${replayed}`, true);

 client.util.importCache.BaseClient.Bot.Presence.file.default(client.cluster!);
};
