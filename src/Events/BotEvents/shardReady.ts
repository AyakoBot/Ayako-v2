import log from '../../BaseClient/UtilModules/logError.js';

export default (id: number, unavailableGuilds?: Set<string>) => {
 log(`[Shard ${id + 1}] Ready - Unavailable Guilds: ${unavailableGuilds?.size ?? '0'}`, true);
};
