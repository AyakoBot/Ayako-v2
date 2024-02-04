import type * as Discord from 'discord.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberUpdate.log.file.default(
  oldMember,
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberUpdate.separator.file.default(
  oldMember,
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberUpdate.cache.file.default(
  oldMember,
  member,
 );

 if (oldMember.partial) return;

 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberUpdate.nitro.file.default(
  oldMember,
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberUpdate.boost.file.default(
  oldMember,
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberUpdate.rewards.file.default(
  oldMember,
  member,
 );

 if (oldMember.pending && !member.pending) {
  member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberAdd.welcome.file.default(
   member,
  );
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
