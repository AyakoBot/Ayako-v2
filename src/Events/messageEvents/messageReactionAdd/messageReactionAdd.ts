import type * as Discord from 'discord.js';
import log from './log.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { Message } from '../../../BaseClient/Other/classes.js';

export default async (reaction: Discord.MessageReaction, user: Discord.User) => {
 if (!reaction.message.guild) return;

 const msg = await ch.request.channels
  .getMessage(reaction.message.guild, reaction.message.channelId, reaction.message.id)
  .then((m) => ('message' in m ? undefined : new Message(reaction.client, m)));
 if (!msg) return;

 const r = msg.reactions.cache.get(reaction.emoji.identifier);
 if (!r?.count && r) r.count = 1;

 log(reaction, user, msg);
};
