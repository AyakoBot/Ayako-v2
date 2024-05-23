import * as Discord from 'discord.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
 if (oldMember.premiumSinceTimestamp === member.premiumSinceTimestamp) return;

 if (!oldMember.premiumSinceTimestamp) startedBoosting(member);
 if (!member.premiumSinceTimestamp) stoppedBoosting(oldMember);

 const settings = await member.client.util.DataBase.nitrosettings.findUnique({
  where: { guildid: member.guild.id, active: true, logchannels: { isEmpty: false } },
 });
 if (!settings) return;

 const started = !oldMember.premiumSinceTimestamp;
 const language = await member.client.util.getLanguage(member.guild.id);
 const embed: Discord.APIEmbed = {
  color: member.client.util.getColor(await member.client.util.getBotMemberFromGuild(member.guild)),
  description: started
   ? language.events.ready.nitro.started(member.user)
   : language.events.ready.nitro.stopped(member.user),
 };

 member.client.util.send(
  { id: settings.logchannels, guildId: member.guild.id },
  { embeds: [embed] },
  10000,
 );
};

export const startedBoosting = (m: Discord.GuildMember) => {
 m.client.util.DataBase.$transaction([
  m.client.util.DataBase.nitrousers.updateMany({
   where: { guildid: m.guild.id, userid: m.id, boostend: null },
   data: { boostend: Date.now() },
  }),
  m.client.util.DataBase.nitrousers.upsert({
   where: { guildid: m.guild.id, userid: m.id, booststart: m.premiumSinceTimestamp as number },
   update: {},
   create: {
    guildid: m.guild.id,
    userid: m.id,
    booststart: m.premiumSinceTimestamp as number,
   },
  }),
 ]).then();
};

export const stoppedBoosting = (m: Discord.GuildMember) => {
 m.client.util.DataBase.nitrousers
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
