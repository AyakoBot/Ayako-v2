import type * as Discord from 'discord.js';
import { scheduleJob } from 'node-schedule';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';
import log from './log.js';

export default async (
 msg: Discord.Message,
 reactions: Discord.Collection<string | Discord.Snowflake, Discord.MessageReaction>,
) => {
 if (!msg.inGuild()) return;

 scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 2000), () => {
  log(msg, reactions);
 });
};
