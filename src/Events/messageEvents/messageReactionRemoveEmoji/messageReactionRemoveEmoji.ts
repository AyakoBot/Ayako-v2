import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (reaction: Discord.MessageReaction) => {
 if (!('guild' in reaction.message.channel)) return;

 await ch.firstGuildInteraction(reaction.message.channel.guild);

 const message = reaction.message.partial
  ? await ch.request.channels.getMessage(reaction.message.channel, reaction.message.id)
  : (reaction.message as Discord.Message<true>);

 if ('message' in message) return;

 log(reaction, message);
};
