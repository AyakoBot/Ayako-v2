import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';
import reactionRoles from './reactionRoles.js';

export default async (reaction: Discord.MessageReaction, user: Discord.User) => {
 if (!reaction.message.guild) return;

 await ch.firstGuildInteraction(reaction.message.guild);

 const msg = await ch.request.channels
  .getMessage(reaction.message.channel as Discord.GuildTextBasedChannel, reaction.message.id)
  .then((m) => ('message' in m ? undefined : m));
 if (!msg) return;

 log(reaction, user, msg);
 reactionRoles(reaction, user, msg);
};
