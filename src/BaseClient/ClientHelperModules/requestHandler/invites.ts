import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

export default {
 get: (guild: Discord.Guild, code: string, query?: Discord.RESTGetAPIInviteQuery) =>
  guild.invites.cache.get(code) ??
  (cache.apis.get(guild.id) ?? API).invites
   .get(code, query)
   .then((i) => {
    const parsed = new Classes.Invite(guild.client, i);
    if (guild.invites.cache.get(parsed.code)) return parsed;
    guild.invites.cache.set(parsed.code, parsed);
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
