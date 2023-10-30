import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';
import { guild as getBotIdFromGuild } from '../getBotIdFrom.js';

/**
 * Retrieves the global slash commands for a guild.
 * @param guild - The guild to retrieve the commands for.
 * @param query - Optional query parameters to filter the commands.
 * @returns A Promise that resolves to an array of parsed ApplicationCommand objects.
 */
const getGlobalCommands = async (
 guild: Discord.Guild,
 query?: Discord.RESTGetAPIApplicationCommandsQuery,
) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGlobalCommands(await getBotIdFromGuild(guild), query)
  .then((cmds) => {
   const parsed = cmds.map((cmd) => new Classes.ApplicationCommand(guild.client, cmd));
   parsed.forEach((p) => {
    if (cache.apis.get(guild.id)) {
     if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [p]);
     else cache.commands.set(guild.id, cache.commands.get(guild.id)!.concat(p));

     return;
    }

    if (guild.client.application.commands.cache.get(p.id)) return;
    guild.client.application.commands.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates a global command for the given guild.
 * @param guild - The guild to create the command for.
 * @param body - The REST API JSON body for the command.
 * @returns A Promise that resolves with the created ApplicationCommand object,
 * or rejects with a DiscordAPIError.
 */
const createGlobalCommand = async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIApplicationCommandsJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .createGlobalCommand(await getBotIdFromGuild(guild), body)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd);

   if (cache.apis.get(guild.id)) {
    if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [parsed]);
    else cache.commands.set(guild.id, cache.commands.get(guild.id)!.concat(parsed));

    return parsed;
   }

   if (guild.client.application.commands.cache.get(parsed.id)) return parsed;
   guild.client.application.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves a global command from the cache or from the Discord API.
 * @param guild - The guild where the command is located.
 * @param commandId - The ID of the command to retrieve.
 * @returns A Promise that resolves with the retrieved command or rejects with an error.
 */
const getGlobalCommand = async (guild: Discord.Guild, commandId: string) =>
 guild.client.application.commands.cache.get(commandId) ??
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGlobalCommand(await getBotIdFromGuild(guild), commandId)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd);
   if (cache.apis.get(guild.id)) {
    if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [parsed]);
    else cache.commands.set(guild.id, cache.commands.get(guild.id)!.concat(parsed));

    return parsed;
   }

   if (guild.client.application.commands.cache.get(parsed.id)) return parsed;
   guild.client.application.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a global command for the given guild.
 * @param guild - The guild where the command is located.
 * @param commandId - The ID of the command to edit.
 * @param body - The new command data to update.
 * @returns A Promise that resolves with the updated command.
 */
const editGlobalCommand = async (
 guild: Discord.Guild,
 commandId: string,
 body: Discord.RESTPatchAPIApplicationCommandJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .editGlobalCommand(await getBotIdFromGuild(guild), commandId, body)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd);

   if (cache.apis.get(guild.id)) {
    if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [parsed]);
    else cache.commands.set(guild.id, cache.commands.get(guild.id)!.concat(parsed));

    return parsed;
   }

   if (guild.client.application.commands.cache.get(parsed.id)) return parsed;
   guild.client.application.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes a global command from the Discord API and removes it from the cache.
 * @param guild - The guild where the command is registered.
 * @param commandId - The ID of the command to be deleted.
 * @returns A promise that resolves when the command is successfully deleted
 * and removed from the cache,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const deleteGlobalCommand = async (guild: Discord.Guild, commandId: string) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .deleteGlobalCommand(await getBotIdFromGuild(guild), commandId)
  .then(() => {
   if (cache.apis.get(guild.id)) {
    cache.commands.set(
     guild.id,
     cache.commands.get(guild.id)!.filter((c) => c.id !== commandId),
    );

    if (cache.commands.get(guild.id)!.length > 0) return;
    cache.commands.delete(guild.id);
    return;
   }

   guild.client.application.commands.cache.delete(commandId);
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Overwrites all global application commands for a guild.
 * @param guild - The guild to overwrite the commands for.
 * @param body - The JSON body containing the new commands.
 * @returns A promise that resolves with an array of the newly created application commands.
 */
const bulkOverwriteGlobalCommands = async (
 guild: Discord.Guild,
 body: Discord.RESTPutAPIApplicationCommandsJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .bulkOverwriteGlobalCommands(await getBotIdFromGuild(guild), body)
  .then((cmds) => {
   const parsed = cmds.map((cmd) => new Classes.ApplicationCommand(guild.client, cmd));
   if (cache.apis.get(guild.id)) {
    cache.commands.set(guild.id, parsed);
    return parsed;
   }

   parsed.forEach((p) => guild.client.application.commands.cache.set(p.id, p));
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the guild commands for a given guild.
 * @param guild The guild to retrieve the commands for.
 * @param query Optional query parameters to include in the request.
 * @returns A Promise that resolves with an array of parsed ApplicationCommand objects.
 */
const getGuildCommands = async (
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
    if (cache.apis.get(guild.id)) {
     if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [p]);
     else cache.commands.set(guild.id, cache.commands.get(guild.id)!.concat(p));

     return;
    }

    if (guild.commands.cache.get(p.id)) return;
    guild.commands.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates a new guild command for the specified guild.
 * @param guild The guild to create the command for.
 * @param body The JSON body of the command.
 * @returns A promise that resolves with the created command.
 */
const createGuildCommand = async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIApplicationGuildCommandsJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .createGuildCommand(await getBotIdFromGuild(guild), guild.id, body)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id);
   if (cache.apis.get(guild.id)) {
    if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [parsed]);
    else cache.commands.set(guild.id, cache.commands.get(guild.id)!.concat(parsed));

    return parsed;
   }

   guild.commands.cache.set(cmd.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves a guild command by ID from the cache or API.
 * @param guild The guild where the command is located.
 * @param commandId The ID of the command to retrieve.
 * @returns A Promise that resolves with the retrieved command, or rejects with an error.
 */
const getGuildCommand = async (guild: Discord.Guild, commandId: string) =>
 guild.commands.cache.get(commandId) ??
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGuildCommand(await getBotIdFromGuild(guild), guild.id, commandId)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id);
   if (cache.apis.get(guild.id)) {
    if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [parsed]);
    else cache.commands.set(guild.id, cache.commands.get(guild.id)!.concat(parsed));

    return parsed;
   }

   guild.commands.cache.set(cmd.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a guild command for a given guild.
 * @param guild The guild where the command is located.
 * @param commandId The ID of the command to edit.
 * @param body The new command data to update.
 * @returns A Promise that resolves with the updated command.
 */
const editGuildCommand = async (
 guild: Discord.Guild,
 commandId: string,
 body: Discord.RESTPatchAPIApplicationGuildCommandJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .editGuildCommand(await getBotIdFromGuild(guild), guild.id, commandId, body)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id);
   if (cache.apis.get(guild.id)) {
    if (!cache.commands.get(guild.id)) cache.commands.set(guild.id, [parsed]);
    else {
     cache.commands.set(
      guild.id,
      cache.commands
       .get(guild.id)!
       .filter((c) => c.id !== parsed.id)!
       .concat(parsed),
     );
    }
    return parsed;
   }

   guild.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes a guild command from the Discord API and removes it from the guild's command cache.
 * @param guild The guild where the command is located.
 * @param commandId The ID of the command to be deleted.
 * @returns A promise that resolves when the command is successfully deleted,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const deleteGuildCommand = async (guild: Discord.Guild, commandId: string) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .deleteGuildCommand(await getBotIdFromGuild(guild), guild.id, commandId)
  .then(() => {
   if (cache.apis.get(guild.id)) {
    cache.commands.set(
     guild.id,
     cache.commands.get(guild.id)!.filter((c) => c.id !== commandId),
    );

    if (cache.commands.get(guild.id)!.length > 0) return;
    cache.commands.delete(guild.id);
    return;
   }

   guild.commands.cache.delete(commandId);
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Overwrites all existing global commands for this application in this guild.
 * @param guild - The guild to overwrite the commands for.
 * @param body - The commands to overwrite.
 * @returns A promise that resolves with an array of the newly created application commands.
 */
const bulkOverwriteGuildCommands = async (
 guild: Discord.Guild,
 body: Discord.RESTPutAPIApplicationGuildCommandsJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .bulkOverwriteGuildCommands(await getBotIdFromGuild(guild), guild.id, body)
  .then((cmds) => {
   const parsed = cmds.map(
    (cmd) => new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id),
   );
   if (cache.apis.get(guild.id)) {
    cache.commands.set(guild.id, parsed);
    return parsed;
   }

   parsed.forEach((p) => guild.commands.cache.set(p.id, p));
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the permissions for a specific command in a guild.
 * @param guild - The guild where the command is located.
 * @param commandId - The ID of the command to retrieve permissions for.
 * @returns A promise that resolves with the command permissions, or rejects with a DiscordAPIError.
 */
const getGuildCommandPermissions = async (guild: Discord.Guild, commandId: string) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGuildCommandPermissions(await getBotIdFromGuild(guild), guild.id, commandId)
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the permissions for all the slash commands in a guild.
 * @param guild - The guild to retrieve the permissions for.
 * @returns A promise that resolves to the permissions for all the slash commands in the guild.
 */
const getGuildCommandsPermissions = async (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .getGuildCommandsPermissions(await getBotIdFromGuild(guild), guild.id)
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits the permissions for a command in a guild.
 * @param guild The guild where the command is located.
 * @param userToken The token of the user making the request.
 * @param commandId The ID of the command to edit.
 * @param body The new permissions for the command.
 * @returns A promise that resolves with the updated command permissions
 * or rejects with a DiscordAPIError.
 */
const editGuildCommandPermissions = async (
 guild: Discord.Guild,
 userToken: string,
 commandId: string,
 body: Discord.RESTPutAPIApplicationCommandPermissionsJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).applicationCommands
  .editGuildCommandPermissions(userToken, await getBotIdFromGuild(guild), guild.id, commandId, body)
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Object containing methods for interacting with global and guild commands.
 * @property {Function} getGlobalCommands
 * - Method to get all global commands.
 * @property {Function} createGlobalCommand
 * - Method to create a new global command.
 * @property {Function} getGlobalCommand
 * - Method to get a specific global command by ID.
 * @property {Function} editGlobalCommand
 * - Method to edit a specific global command by ID.
 * @property {Function} deleteGlobalCommand
 * - Method to delete a specific global command by ID.
 * @property {Function} bulkOverwriteGlobalCommands
 * - Method to bulk overwrite all global commands.
 * @property {Function} getGuildCommands
 * - Method to get all guild commands for a specific guild.
 * @property {Function} createGuildCommand
 * - Method to create a new guild command for a specific guild.
 * @property {Function} getGuildCommand
 * - Method to get a specific guild command by ID for a specific guild.
 * @property {Function} editGuildCommand
 * - Method to edit a specific guild command by ID for a specific guild.
 * @property {Function} deleteGuildCommand
 * - Method to delete a specific guild command by ID for a specific guild.
 * @property {Function} bulkOverwriteGuildCommands
 * - Method to bulk overwrite all guild commands for a specific guild.
 * @property {Function} getGuildCommandPermissions
 * - Method to get the permissions for a specific guild command by ID for a specific guild.
 * @property {Function} getGuildCommandsPermissions
 * - Method to get the permissions for all guild commands for a specific guild.
 * @property {Function} editGuildCommandPermissions
 * - Method to edit the permissions for a specific guild command by ID for a specific guild.
 */
export default {
 getGlobalCommands,
 createGlobalCommand,
 getGlobalCommand,
 editGlobalCommand,
 deleteGlobalCommand,
 bulkOverwriteGlobalCommands,
 getGuildCommands,
 createGuildCommand,
 getGuildCommand,
 editGuildCommand,
 deleteGuildCommand,
 bulkOverwriteGuildCommands,
 getGuildCommandPermissions,
 getGuildCommandsPermissions,
 editGuildCommandPermissions,
};
