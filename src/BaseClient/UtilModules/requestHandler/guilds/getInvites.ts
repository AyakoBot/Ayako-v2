import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Retrieves the invites for a given guild.
 * @param guild The guild to retrieve invites for.
 * @returns A promise that resolves with an array of parsed invite objects.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetInvites(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot get invites`, [Discord.PermissionFlagsBits.ManageGuild]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).guilds
  .getInvites(guild.id)
  .then((invites) => {
   const parsed = invites.map((i) => new Classes.Invite(guild.client, i));
   parsed.forEach((p) => {
    if (guild.invites.cache.get(p.code)) return;
    guild.invites.cache.set(p.code, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the specified guild member has the permission to get guild invites.
 * @param me - The guild member to check.
 * @returns A promise that resolves to a boolean,
 * indicating whether the guild member can get guild invites.
 */
export const canGetInvites = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
