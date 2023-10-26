import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

/**
 * Retrieves a user from the cache or from the API if not found in cache.
 * @param guild - The guild where the user is located.
 * @param userId - The ID of the user to retrieve.
 * @returns A Promise that resolves to the user object.
 */
const get = async (guild: Discord.Guild, userId: string) =>
 guild.client.users.cache.get(userId) ??
 (cache.apis.get(guild.id) ?? API).users
  .get(userId)
  .then((u) => {
   const parsed = new Classes.User(guild.client, u);
   if (guild.client.users.cache.get(parsed.id)) return parsed;
   guild.client.users.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => e as Discord.DiscordAPIError);

/**
 * Returns the current user for the given guild.
 * @param guild - The guild to get the current user for.
 * @returns A promise that resolves with a new instance of the ClientUser class
 * representing the current user, or rejects with a DiscordAPIError if an error occurs.
 */
const getCurrent = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).users
  .getCurrent()
  .then((u) => new Classes.ClientUser(guild.client, u))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Returns the guilds for the current user.
 * @param guild The guild object.
 * @param query Optional query parameters for the API request.
 * @returns A promise that resolves with the guilds for the current user,
 * or rejects with a DiscordAPIError.
 */
const getGuilds = (guild: Discord.Guild, query?: Discord.RESTGetAPICurrentUserGuildsQuery) =>
 (cache.apis.get(guild.id) ?? API).users.getGuilds(query).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Leaves the specified guild.
 * @param guild - The guild to leave.
 * @returns A promise that resolves with the DiscordAPIError if an error occurs, otherwise void.
 */
const leaveGuild = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).users.leaveGuild(guild.id).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Edits the current user's profile in the specified guild.
 * @param guild The guild where the user's profile will be edited.
 * @param data The data to update the user's profile.
 * @returns A promise that resolves with the updated user's profile.
 */
const edit = async (guild: Discord.Guild, data: Discord.RESTPatchAPICurrentUserJSONBody) =>
 (cache.apis.get(guild.id) ?? API).users
  .edit({
   ...data,
   avatar: data.avatar ? await Discord.DataResolver.resolveImage(data.avatar) : data.avatar,
  })
  .then((u) => new Classes.User(guild.client, u))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits the current guild member with the given data.
 * @param guild The guild where the member is located.
 * @param data The data to update the member with.
 * @returns A promise that resolves with the updated guild member
 * or rejects with a DiscordAPIError.
 */
const editCurrentGuildMember = (
 guild: Discord.Guild,
 data: Discord.RESTPatchAPIGuildMemberJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).users
  .editCurrentGuildMember(guild.id, data)
  .then((m) => new Classes.GuildMember(guild.client, m, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates a direct message channel between the bot and the specified user.
 * @param guild The guild where the DM will be created.
 * @param userId The ID of the user to create the DM with.
 * @returns A promise that resolves with the created DM channel,
 * or rejects with a DiscordAPIError if the DM creation fails.
 */
const createDM = (guild: Discord.Guild, userId: string) =>
 (cache.apis.get(guild.id) ?? API).users
  .createDM(userId)
  .then((c) => Classes.Channel<1>(guild.client, c, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Returns the current connections of the users in the specified guild.
 * If the connections cannot be retrieved, logs an error and returns the error object.
 * @param guild - The guild to retrieve the connections for.
 * @returns A promise that resolves to an array of user connections or an error object.
 */
const getCurrentConnections = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).users.getConnections().catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Returns the application role connection for the given application ID in the specified guild.
 * If the guild has an API cache, it will be used, otherwise the default API will be used.
 * @param guild - The guild to get the application role connection from.
 * @param applicationId - The ID of the application to get the role connection for.
 * @returns A promise that resolves to the application role connection,
 * or rejects with a DiscordAPIError.
 */
const getApplicationRoleConnection = (guild: Discord.Guild, applicationId: string) =>
 (cache.apis.get(guild.id) ?? API).users.getApplicationRoleConnection(applicationId).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Updates the application role connection for the given guild.
 * @param guild - The guild to update the application role connection for.
 * @param applicationId - The ID of the application to update the role connection for.
 * @param body - The JSON body containing the updated role connection information.
 * @returns A promise that resolves with the updated role connection information,
 * or rejects with an error.
 */
const updateApplicationRoleConnection = (
 guild: Discord.Guild,
 applicationId: string,
 body: Discord.RESTPutAPICurrentUserApplicationRoleConnectionJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).users
  .updateApplicationRoleConnection(applicationId, body)
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });

/**
 * Object containing methods for handling user-related requests.
 * @property {Function} get
 * - Method for getting a user by ID.
 * @property {Function} getCurrent
 * - Method for getting the current user.
 * @property {Function} getGuilds
 * - Method for getting the guilds that the current user is a member of.
 * @property {Function} leaveGuild
 * - Method for leaving a guild.
 * @property {Function} edit
 * - Method for editing a user.
 * @property {Function} editCurrentGuildMember
 * - Method for editing the current user's guild member data.
 * @property {Function} createDM
 * - Method for creating a direct message channel with a user.
 * @property {Function} getCurrentConnections
 * - Method for getting the current user's connections.
 * @property {Function} getApplicationRoleConnection
 * - Method for getting the current user's application role connection.
 * @property {Function} updateApplicationRoleConnection
 * - Method for updating the current user's application role connection.
 */
export default {
 get,
 getCurrent,
 getGuilds,
 leaveGuild,
 edit,
 editCurrentGuildMember,
 createDM,
 getCurrentConnections,
 getApplicationRoleConnection,
 updateApplicationRoleConnection,
};
