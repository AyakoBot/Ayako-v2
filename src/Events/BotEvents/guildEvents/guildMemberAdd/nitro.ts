import * as Discord from 'discord.js';

// I don't think this will ever happen, but let's handle it anyways
export default async (member: Discord.GuildMember) => {
 if (!member.premiumSinceTimestamp) return;

 member.client.util.importCache.Events.BotEvents.guildEvents.guildMemberUpdate.nitro.file.startedBoosting(
  member,
 );
};
