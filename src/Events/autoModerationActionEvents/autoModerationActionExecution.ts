import type * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

import censor from './censor.js';
import invites from './invites.js';
import log from './log.js';
import wordscraper from './wordscraper.js';

export default async (msg: Discord.AutoModerationActionExecution) => {
 await ch.firstGuildInteraction(msg.guild);

 log(msg);
 wordscraper(msg);
 censor(msg);
 invites(msg);
};
