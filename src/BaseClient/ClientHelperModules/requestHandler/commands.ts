import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';
import { guild as getBotIdFromGuild } from '../getBotIdFrom.js';

export default {
 getGlobalCommands: async (
  guild: Discord.Guild,
  query?: Discord.RESTGetAPIApplicationCommandsQuery,
 ) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .getGlobalCommands(await getBotIdFromGuild(guild), query)
   .then((cmds) => {
    const parsed = cmds.map((cmd) => new Classes.ApplicationCommand(guild.client, cmd));
    parsed.forEach((p) => {
     if (guild.client.application.commands.cache.get(p.id)) return;
     guild.client.application.commands.cache.set(p.id, p);
    });
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 createGlobalCommand: async (
  guild: Discord.Guild,
  body: Discord.RESTPostAPIApplicationCommandsJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .createGlobalCommand(await getBotIdFromGuild(guild), body)
   .then((cmd) => {
    const parsed = new Classes.ApplicationCommand(guild.client, cmd);
    guild.client.application.commands.cache.set(cmd.id, parsed);
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getGlobalCommand: async (guild: Discord.Guild, commandId: string) =>
  guild.client.application.commands.cache.get(commandId) ??
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .getGlobalCommand(await getBotIdFromGuild(guild), commandId)
   .then((cmd) => {
    const parsed = new Classes.ApplicationCommand(guild.client, cmd);
    if (guild.client.application.commands.cache.get(parsed.id)) return parsed;
    guild.client.application.commands.cache.set(parsed.id, parsed);
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 editGlobalCommand: async (
  guild: Discord.Guild,
  commandId: string,
  body: Discord.RESTPatchAPIApplicationCommandJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .editGlobalCommand(await getBotIdFromGuild(guild), commandId, body)
   .then((cmd) => {
    const parsed = new Classes.ApplicationCommand(guild.client, cmd);
    guild.client.application.commands.cache.set(cmd.id, parsed);
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 deleteGlobalCommand: async (guild: Discord.Guild, commandId: string) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .deleteGlobalCommand(await getBotIdFromGuild(guild), commandId)
   .then(() => {
    guild.client.application.commands.cache.delete(commandId);
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 bulkOverwriteGlobalCommands: async (
  guild: Discord.Guild,
  body: Discord.RESTPutAPIApplicationCommandsJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .bulkOverwriteGlobalCommands(await getBotIdFromGuild(guild), body)
   .then((cmds) => {
    const parsed = cmds.map((cmd) => new Classes.ApplicationCommand(guild.client, cmd));
    parsed.forEach((p) => guild.client.application.commands.cache.set(p.id, p));
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getGuildCommands: async (
  guild: Discord.Guild,
  query?: Discord.RESTGetAPIApplicationGuildCommandsQuery,
 ) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .getGuildCommands(await getBotIdFromGuild(guild), guild.id, query)
   .then((cmds) => {
    const parsed = cmds.map(
     (cmd) => new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id),
    );
    parsed.forEach((p) => {
     if (guild.commands.cache.get(p.id)) return;
     guild.commands.cache.set(p.id, p);
    });
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 createGuildCommand: async (
  guild: Discord.Guild,
  body: Discord.RESTPostAPIApplicationGuildCommandsJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .createGuildCommand(await getBotIdFromGuild(guild), guild.id, body)
   .then((cmd) => {
    const parsed = new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id);
    guild.commands.cache.set(cmd.id, parsed);
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getGuildCommand: async (guild: Discord.Guild, commandId: string) =>
  guild.commands.cache.get(commandId) ??
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .getGuildCommand(await getBotIdFromGuild(guild), guild.id, commandId)
   .then((cmd) => {
    const parsed = new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id);
    if (guild.commands.cache.get(parsed.id)) return parsed;
    guild.commands.cache.set(parsed.id, parsed);
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 editGuildCommand: async (
  guild: Discord.Guild,
  commandId: string,
  body: Discord.RESTPatchAPIApplicationGuildCommandJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .editGuildCommand(await getBotIdFromGuild(guild), guild.id, commandId, body)
   .then((cmd) => {
    const parsed = new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id);
    guild.commands.cache.set(cmd.id, parsed);
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 deleteGuildCommand: async (guild: Discord.Guild, commandId: string) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .deleteGuildCommand(await getBotIdFromGuild(guild), guild.id, commandId)
   .then(() => {
    guild.commands.cache.delete(commandId);
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 bulkOverwriteGuildCommands: async (
  guild: Discord.Guild,
  body: Discord.RESTPutAPIApplicationGuildCommandsJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .bulkOverwriteGuildCommands(await getBotIdFromGuild(guild), guild.id, body)
   .then((cmds) => {
    const parsed = cmds.map(
     (cmd) => new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id),
    );
    parsed.forEach((p) => guild.commands.cache.set(p.id, p));
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getGuildCommandPermissions: async (guild: Discord.Guild, commandId: string) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .getGuildCommandPermissions(await getBotIdFromGuild(guild), guild.id, commandId)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getGuildCommandsPermissions: async (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .getGuildCommandsPermissions(await getBotIdFromGuild(guild), guild.id)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 editGuildCommandPermissions: async (
  guild: Discord.Guild,
  userToken: string,
  commandId: string,
  body: Discord.RESTPutAPIApplicationCommandPermissionsJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).applicationCommands
   .editGuildCommandPermissions(
    userToken,
    await getBotIdFromGuild(guild),
    guild.id,
    commandId,
    body,
   )
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
};
