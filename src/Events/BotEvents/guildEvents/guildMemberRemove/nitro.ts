import * as Discord from 'discord.js';

export default async (member: Discord.GuildMember) => {
 if (!member.premiumSinceTimestamp) return;

 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberUpdate.nitro.file.stoppedBoosting(
  member,
 );
};
