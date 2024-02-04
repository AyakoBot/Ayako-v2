import log from '../../BaseClient/UtilModules/logError.js';
import client from '../../BaseClient/Bot/Client.js';

export default async (id: number, unavailableGuilds?: Set<string>) => {
 log(`[Shard ${id + 1}] Ready - Unavailable Guilds: ${unavailableGuilds?.size ?? '0'}`, true);

 client.util.importCache.BaseClient.Bot.Presence.file.default(client.cluster!);
};
