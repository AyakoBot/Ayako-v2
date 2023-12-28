import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (oldEmote: Discord.GuildEmoji, emote: Discord.GuildEmoji) => {
 await ch.firstGuildInteraction(emote.guild);

 log(oldEmote, emote);
};
