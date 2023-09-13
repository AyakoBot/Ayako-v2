import * as Discord from 'discord.js';
import { guild as getBotIdFromGuild } from './getBotIdFrom.js';
import { request } from './requestHandler.js';
import error from './error.js';

export default async (guild: Discord.Guild) => {
 const botId = await getBotIdFromGuild(guild);
 const rawMember = await request.guilds.getMember(guild, botId);
 if ('message' in rawMember) {
  error(guild, new Error(rawMember.message));
  return guild.members.fetchMe();
 }

 return rawMember;
};
