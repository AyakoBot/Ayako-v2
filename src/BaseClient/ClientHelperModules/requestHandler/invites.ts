import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

const cacheSetter = (
 cacheItem: unknown,
 // eslint-disable-next-line @typescript-eslint/ban-types
 cacheSet: Function | undefined,
 item: unknown,
 key?: string,
) => {
 if (!cacheSet) return;
 if (!cacheItem) cacheSet(key ?? (item as { [key: string]: string }).id, item);
};

export default {
 get: (guild: Discord.Guild, code: string, query?: Discord.RESTGetAPIInviteQuery) =>
  (cache.apis.get(guild.id) ?? API).invites
   .get(code, query)
   .then((i) => {
    const parsed = new Classes.Invite(guild.client, i);
    cacheSetter(guild.invites.cache.get(parsed.code), guild.invites.cache.set, parsed, parsed.code);
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 delete: (guild: Discord.Guild, code: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).invites.delete(code, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
};
