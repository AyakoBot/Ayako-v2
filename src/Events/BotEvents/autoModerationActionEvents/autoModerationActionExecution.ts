import type * as Discord from 'discord.js';

export default async (msg: Discord.AutoModerationActionExecution) => {
 msg.guild.client.util.importCache.Events.BotEvents.autoModerationActionEvents.log.file.default(
  msg,
 );
 msg.guild.client.util.importCache.Events.BotEvents.autoModerationActionEvents.wordscraper.file.default(
  msg,
 );
 msg.guild.client.util.importCache.Events.BotEvents.autoModerationActionEvents.censor.file.default(
  msg,
 );
 msg.guild.client.util.importCache.Events.BotEvents.autoModerationActionEvents.invites.file.default(
  msg,
 );
};
