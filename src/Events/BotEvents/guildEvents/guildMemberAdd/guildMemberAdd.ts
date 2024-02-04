import * as Discord from 'discord.js';

export default async (member: Discord.GuildMember) => {
 if (!member.guild) return;

 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.log.file.default(
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.ptReminder.file.default(
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.welcome.file.default(
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.stickyPerms.file.default(
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.checkMuted.file.default(
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.nitro.file.default(
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.antiraid.file.default(
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.affiliates.file.default(
  member,
 );

 if (!member.guild.features.includes(Discord.GuildFeature.WelcomeScreenEnabled)) {
  member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.autoroles.file.default(
   member,
  );
  member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.verification.file.default(
   member,
  );
  member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.stickyRoles.file.default(
   member,
  );
 }
};
