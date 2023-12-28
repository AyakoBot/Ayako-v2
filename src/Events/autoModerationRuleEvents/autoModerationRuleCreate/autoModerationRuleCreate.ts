import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (rule: Discord.AutoModerationRule) => {
 await ch.firstGuildInteraction(rule.guild);

 log(rule);
};
