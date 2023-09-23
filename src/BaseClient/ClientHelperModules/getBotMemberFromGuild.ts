import * as Discord from 'discord.js';
import { guild as getBotIdFromGuild } from './getBotIdFrom.js';
// eslint-disable-next-line import/no-cycle
import { request } from './requestHandler.js';

/**
 * Returns the bot member from a guild.
 * @param guild The guild to get the bot member from.
 * @returns The bot member from the guild, or undefined if the guild is null or undefined.
 */
export default async (guild: Discord.Guild | null | undefined) => {
 if (!guild) return undefined;

 return (
  request.guilds
   .getMember(guild, await getBotIdFromGuild(guild))
   .then((m) => ('message' in m ? undefined : m)) ?? guild.members.me
 );
};
