import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (member: Discord.GuildMember) => {
 if (!member.communicationDisabledUntil) mute(member);
 else unmute(member);
};

const mute = async (member: Discord.GuildMember) => {
 const allMutes = await ch.DataBase.punish_tempmutes.findMany({
  where: { guildid: member.guild.id, userid: member.id },
 });

 const activeMute = allMutes.find(
  (m) => Number(m.uniquetimestamp) + Number(m.duration) * 1000 > Date.now(),
 );
 if (!activeMute) return;

 ch.request.guilds.editMember(
  member.guild,
  member.id,
  {
   communication_disabled_until: new Date(
    Number(activeMute.uniquetimestamp) + Number(activeMute.duration) * 1000,
   ).toISOString(),
  },
  activeMute?.reason ?? undefined,
 );
};

const unmute = async (member: Discord.GuildMember) => {
 const allMutes = await ch.DataBase.punish_tempmutes.findMany({
  where: { guildid: member.guild.id, userid: member.id },
 });

 const activeMute = allMutes.find(
  (m) => Number(m.uniquetimestamp) + Number(m.duration) * 1000 > Date.now(),
 );
 if (activeMute) return;

 ch.request.guilds.editMember(member.guild, member.id, {
  communication_disabled_until: null,
 });
};
