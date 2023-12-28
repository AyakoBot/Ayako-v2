import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (emote: Discord.GuildEmoji) => {
 await ch.firstGuildInteraction(emote.guild);

 log(emote);
};
