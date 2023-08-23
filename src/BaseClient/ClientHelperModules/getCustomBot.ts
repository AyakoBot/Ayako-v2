import * as Discord from 'discord.js';
import getBotIdFromToken from './getBotIdFromToken.js';
import DataBase from '../DataBase.js';
import { request } from './requestHandler.js';
import { GuildMember } from '../Other/classes.js';
import error from './error.js';

export default async (guild: Discord.Guild) => {
 const settings = await DataBase.guildsettings.findUnique({
  where: { guildid: guild.id, token: { not: null } },
 });
 if (!settings) return guild.members.fetchMe();

 const botId = getBotIdFromToken(settings.token as string);
 const rawMember = await request.guilds.getMember(guild, botId);
 if ('message' in rawMember) {
  error(guild, new Error(rawMember.message));
  return guild.members.fetchMe();
 }

 return new GuildMember(guild.client, rawMember, guild);
};
