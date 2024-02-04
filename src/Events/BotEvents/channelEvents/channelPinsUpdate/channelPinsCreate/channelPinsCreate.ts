import type * as Discord from 'discord.js';

export default async (
 pin: Discord.Message,
 channel:
  | Discord.NewsChannel
  | Discord.TextChannel
  | Discord.PrivateThreadChannel
  | Discord.PublicThreadChannel
  | Discord.VoiceChannel,
 date: Date,
) => {
 pin.client.util.importCache.Events.BotEvents.channelEvents.channelPinsUpdate.channelPinsCreate.log.file.default(
  pin,
  channel,
  date,
 );
};
