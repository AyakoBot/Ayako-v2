import type * as Discord from 'discord.js';

export default async (member: Discord.GuildMember) => {
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberRemove.log.file.default(
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberRemove.nitro.file.default(
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberRemove.stickyRoles.file.default(
  member,
 );
 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberRemove.customRole.file.default(
  member,
 );
};
