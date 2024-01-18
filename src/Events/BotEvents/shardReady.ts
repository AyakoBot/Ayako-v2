import log from '../../BaseClient/UtilModules/logError.js';
import Presence from '../../BaseClient/Bot/Presence.js';
import client from '../../BaseClient/Bot/Client.js';

export default (id: number, unavailableGuilds?: Set<string>) => {
 log(`[Shard ${id + 1}] Ready - Unavailable Guilds: ${unavailableGuilds?.size ?? '0'}`, true);
 Presence(client.cluster!);
};
