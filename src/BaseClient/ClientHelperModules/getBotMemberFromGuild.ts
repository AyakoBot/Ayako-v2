import * as Discord from 'discord.js';
import { guild as getBotIdFromGuild } from './getBotIdFrom.js';
import { request } from './requestHandler.js';

export default async (guild: Discord.Guild | null | undefined) => {
 if (!guild) return undefined;

 return (
  request.guilds
   .getMember(guild, await getBotIdFromGuild(guild))
   .then((m) => ('message' in m ? undefined : m)) ?? guild.members.me
 );
};
