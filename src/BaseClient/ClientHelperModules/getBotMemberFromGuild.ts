import * as Discord from 'discord.js';
import { guild as getBotIdFromGuild } from './getBotIdFrom.js';
// eslint-disable-next-line import/no-cycle
import { request } from './requestHandler.js';
import error from './error.js';

/**
 * Retrieves the custom bot member from the given guild.
 * @param guild - The guild to retrieve the custom bot member from.
 * @returns A Promise that resolves with the custom bot member.
 */
export default async (guild: Discord.Guild) => {
 const botId = await getBotIdFromGuild(guild);
 const rawMember = await request.guilds.getMember(guild, botId);

 if ('message' in rawMember) {
  error(guild, new Error(rawMember.message));
  return request.guilds.getMember(
   undefined,
   guild.client.user.id,
   guild,
  ) as Promise<Discord.GuildMember>;
 }

 return rawMember;
};
