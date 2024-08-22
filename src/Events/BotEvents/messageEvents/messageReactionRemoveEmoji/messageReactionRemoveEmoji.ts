import * as Discord from 'discord.js';
import { scheduleJob } from 'node-schedule';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';
import log from './log.js';

export default async (reaction: Discord.MessageReaction) => {
 if (!('guild' in reaction.message.channel)) return;

 await reaction.client.util.firstGuildInteraction(
  reaction.message.channel.guild,
  Discord.Events.MessageReactionRemoveEmoji,
 );

 const message = reaction.message.partial
  ? await reaction.client.util.request.channels.getMessage(
     reaction.message.channel,
     reaction.message.id,
    )
  : (reaction.message as Discord.Message<true>);

 if ('message' in message) return;

 scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 2000), () => {
  log(reaction, message);
 });
};
