import type * as Discord from 'discord.js';
import log from './log.js';

export default async (oldEmote: Discord.GuildEmoji, emote: Discord.GuildEmoji) => {
  log(oldEmote, emote);
};
