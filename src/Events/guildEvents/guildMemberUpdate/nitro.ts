import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
 if (oldMember.premiumSinceTimestamp === member.premiumSinceTimestamp) return;

 if (!oldMember.premiumSinceTimestamp) startedBoosting(member);
 if (!member.premiumSinceTimestamp) stoppedBoosting(oldMember);

 const settings = await ch.DataBase.nitrosettings.findUnique({
  where: { guildid: member.guild.id, active: true, logchannels: { isEmpty: false } },
 });
 if (!settings) return;

 const started = !oldMember.premiumSinceTimestamp;
 const language = await ch.getLanguage(member.guild.id);
 const embed: Discord.APIEmbed = {
  color: ch.getColor(await ch.getBotMemberFromGuild(member.guild)),
  description: started
   ? language.events.ready.nitro.started(member.user)
   : language.events.ready.nitro.stopped(member.user),
 };

 ch.send(
  { id: settings.logchannels, guildId: member.guild.id },
  { embeds: [embed] },
  undefined,
  10000,
 );
};

export const startedBoosting = (m: Discord.GuildMember) => {
 ch.DataBase.nitrousers
  .create({
   data: {
    guildid: m.guild.id,
    userid: m.id,
    booststart: m.premiumSinceTimestamp as number,
   },
  })
  .then();
};

export const stoppedBoosting = (m: Discord.GuildMember) => {
 ch.DataBase.nitrousers
  .updateMany({
   where: {
    guildid: m.guild.id,
    userid: m.id,
    boostend: null,
   },
   data: {
    guildid: m.guild.id,
    userid: m.id,
    boostend: Date.now(),
   },
  })
  .then();
};
