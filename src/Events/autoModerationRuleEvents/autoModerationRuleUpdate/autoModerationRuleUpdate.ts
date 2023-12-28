import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (
 oldRule: Discord.AutoModerationRule | undefined,
 rule: Discord.AutoModerationRule,
) => {
 await ch.firstGuildInteraction(rule.guild);

 log(oldRule, rule);
};
