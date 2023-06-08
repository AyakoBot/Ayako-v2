import type * as Discord from 'discord.js';
import log from './log.js';
import wordscraper from './wordscraper.js';
import censor from './censor.js';

export default async (msg: Discord.AutoModerationActionExecution) => {
 log(msg);
 wordscraper(msg);
 censor(msg);
};
