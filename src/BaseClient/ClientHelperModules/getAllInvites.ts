import * as Discord from 'discord.js';
import { request } from './requestHandler.js';
import getBotMemberFromGuild from './getBotMemberFromGuild.js';

export default async (guild: Discord.Guild) => {
 const { cache } = guild.invites;

 const me = await getBotMemberFromGuild(guild);
 if (!me) return [];
 if (me?.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) return cache.map((i) => i);

 await request.guilds.getInvites(guild);
 if (!guild.vanityURLCode) return cache.map((i) => i);

 await request.guilds.getVanityURL(guild);
 return cache.map((i) => i);
};
