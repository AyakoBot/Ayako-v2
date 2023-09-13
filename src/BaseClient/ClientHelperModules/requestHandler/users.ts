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
 get: (guild: Discord.Guild, userId: string) =>
  (cache.apis.get(guild.id) ?? API).users
   .get(userId)
   .then((u) => {
    const parsed = new Classes.User(guild.client, u);
    cacheSetter(guild.client.users.cache.get(parsed.id), guild.client.users.cache.set, parsed);
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getCurrent: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).users
   .getCurrent()
   .then((u) => new Classes.ClientUser(guild.client, u))
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getGuilds: (guild: Discord.Guild, query?: Discord.RESTGetAPICurrentUserGuildsQuery) =>
  (cache.apis.get(guild.id) ?? API).users.getGuilds(query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 leaveGuild: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).users.leaveGuild(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 edit: (guild: Discord.Guild, data: Discord.RESTPatchAPICurrentUserJSONBody) =>
  (cache.apis.get(guild.id) ?? API).users
   .edit(data)
   .then((u) => new Classes.User(guild.client, u))
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 editCurrentGuildMember: (guild: Discord.Guild, data: Discord.RESTPatchAPIGuildMemberJSONBody) =>
  (cache.apis.get(guild.id) ?? API).users
   .editCurrentGuildMember(guild.id, data)
   .then((m) => new Classes.GuildMember(guild.client, m, guild))
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 createDM: (guild: Discord.Guild, userId: string) =>
  (cache.apis.get(guild.id) ?? API).users
   .createDM(userId)
   .then((c) => Classes.Channel<1>(guild.client, c, guild))
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getCurrentConnections: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).users.getConnections().catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getApplicationRoleConnection: (guild: Discord.Guild, applicationId: string) =>
  (cache.apis.get(guild.id) ?? API).users.getApplicationRoleConnection(applicationId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 updateApplicationRoleConnection: (
  guild: Discord.Guild,
  applicationId: string,
  body: Discord.RESTPutAPICurrentUserApplicationRoleConnectionJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).users
   .updateApplicationRoleConnection(applicationId, body)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e;
   }),
};
