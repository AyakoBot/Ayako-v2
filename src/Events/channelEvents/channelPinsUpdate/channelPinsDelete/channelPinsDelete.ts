import type * as Discord from 'discord.js';
import log from './log.js';

export default async (
 pin: Discord.Message,
 channel:
  | Discord.NewsChannel
  | Discord.TextChannel
  | Discord.PrivateThreadChannel
  | Discord.PublicThreadChannel
  | Discord.VoiceChannel,
) => {
 log(pin, channel);
};
