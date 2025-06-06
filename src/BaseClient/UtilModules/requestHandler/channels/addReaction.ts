import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import requestHandler from '../../requestHandler.js';
import DataBase from '../../../Bot/DataBase.js';

/**
 * Adds a reaction to a message.
 * @param msg The message to add the reaction to.
 * @param emoji The emoji to add as a reaction.
 * @returns A Promise that resolves with the DiscordAPIError if the reaction could not be added.
 */
export default async (msg: Discord.Message<true>, emoji: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!isReactable(msg, emoji, await getBotMemberFromGuild(msg.guild))) {
  const e = requestHandlerError(
   `Cannot apply ${emoji} as reaction in ${msg.channel.name} / ${msg.channel.id}`,
   [
    Discord.PermissionFlagsBits.AddReactions,
    Discord.PermissionFlagsBits.ReadMessageHistory,
    ...(emoji.includes(':') ? [Discord.PermissionFlagsBits.UseExternalEmojis] : []),
   ],
  );

  error(msg.guild, e);
  return e;
 }

 if (await hasBlocked(msg.author)) return undefined;

 const resolvedEmoji = Discord.resolvePartialEmoji(emoji) as Discord.PartialEmoji;
 if (!resolvedEmoji) {
  const e = requestHandlerError(`Invalid Emoji ${emoji}`, []);

  error(msg.guild, e);
  return e;
 }

 return (await getAPI(msg.guild)).channels
  .addMessageReaction(
   msg.channel.id,
   msg.id,
   resolvedEmoji.id
    ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
    : (resolvedEmoji.name as string),
  )
  .catch((e: Discord.DiscordAPIError) => {
   saveBlocked(e.message, msg.author);

   error(msg.guild, e);
   return e;
  });
};

/**
 * Checks if a message is reactable by a given user.
 * @param msg - The message to check.
 * @param emoji - The emoji to add as a reaction.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the message is reactable.
 */
export const isReactable = (msg: Discord.Message<true>, emoji: string, me: Discord.GuildMember) =>
 msg.channel.permissionsFor(me).has(Discord.PermissionFlagsBits.AddReactions) &&
 msg.channel.permissionsFor(me).has(Discord.PermissionFlagsBits.ReadMessageHistory) &&
 (emoji.includes(':')
  ? msg.channel.permissionsFor(me).has(Discord.PermissionFlagsBits.UseExternalEmojis)
  : true);

/**
 * Checks if the user has blocked the bot.
 *
 * @param user - The user object or an object with `id` and `client` properties.
 * @returns A boolean indicating whether the user has blocked the bot.
 */
const hasBlocked = async (user: Discord.User | { id: string; client: Discord.Client<true> }) => {
 const u = await user.client.util.DataBase.blockingUsers.findUnique({ where: { userId: user.id } });

 if (!u) return false;

 if (Number(u.created) < Date.now() - 2592000000) {
  user.client.util.DataBase.blockingUsers.delete({ where: { userId: user.id } }).then();

  return false;
 }

 return true;
};

/**
 * Saves the blocked reaction error and updates the blocking user in the database.
 *
 * @param error - The error message.
 * @param user - The user who triggered the error.
 */
const saveBlocked = async (
 err: string,
 user: Discord.User | { id: string; client: Discord.Client<true> },
) => {
 if (!err.includes('Reaction blocked')) return;

 user.client.util.DataBase.blockingUsers
  .upsert({
   where: { userId: user.id },
   create: { userId: user.id, created: Date.now() },
   update: { created: Date.now() },
  })
  .then();
};

const getTokenFromGuild = (guild: Discord.Guild) =>
 DataBase.customclients
  .findUnique({
   where: { guildid: guild.id, token: { not: null } },
   select: { token: true },
  })
  .then((c) => c?.token!);

export const getAPI = async (guild: Discord.Guild | undefined | null) => {
 if (!guild) return API;

 const api = (((await getBotMemberFromGuild(guild)) && cache.apis.get(guild.id)) ?? null) || null;
 if (api) return api;

 const token = await getTokenFromGuild(guild);
 if (!token) return API;

 const newApi = await requestHandler(guild.id, token);
 return newApi ? cache.apis.get(guild.id) || API : API;
};
