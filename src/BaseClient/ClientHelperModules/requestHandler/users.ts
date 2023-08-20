import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
import cache from '../cache.js';

export default {
 get: (guild: Discord.Guild, userId: string) =>
  (cache.apis.get(guild.id) ?? API).users.get(userId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getCurrent: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).users.getCurrent().catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getGuilds: (guild: Discord.Guild, query?: Discord.RESTGetAPICurrentUserGuildsQuery) =>
  (cache.apis.get(guild.id) ?? API).users.getGuilds(query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 leaveGuild: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).users.leaveGuild(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 edit: (guild: Discord.Guild, data: Discord.RESTPatchAPICurrentUserJSONBody) =>
  (cache.apis.get(guild.id) ?? API).users.edit(data).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getCurrentMember: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).users.getGuildMember(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 editCurrentGuildMember: (guild: Discord.Guild, data: Discord.RESTPatchAPIGuildMemberJSONBody) =>
  (cache.apis.get(guild.id) ?? API).users.editCurrentGuildMember(guild.id, data).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 createDM: (guild: Discord.Guild, userId: string) =>
  (cache.apis.get(guild.id) ?? API).users.createDM(userId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getCurrentConnections: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).users.getConnections().catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getApplicationRoleConnection: (guild: Discord.Guild, applicationId: string) =>
  (cache.apis.get(guild.id) ?? API).users.getApplicationRoleConnection(applicationId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
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
   }),
};
