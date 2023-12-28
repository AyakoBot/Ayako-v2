import type * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (typing: Discord.Typing) => {
 if (!typing.inGuild()) return;

 await ch.firstGuildInteraction(typing.guild);

 log(typing);
};
