import * as Discord from 'discord.js';
import { scheduleJob } from 'node-schedule';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';
import log from './log.js';
import reactionRoles from './reactionRoles.js';
import votePunish from './votePunish.js';

export default async (reaction: Discord.MessageReaction, user: Discord.User) => {
 if (!reaction.message.guild) return;

 await reaction.client.util.firstGuildInteraction(
  reaction.message.guild,
  Discord.Events.MessageReactionAdd,
 );

 const msg = await reaction.client.util.request.channels
  .getMessage(reaction.message.channel as Discord.GuildTextBasedChannel, reaction.message.id)
  .then((m) => ('message' in m ? undefined : m));
 if (!msg) return;

 const r = msg.reactions.cache.get(reaction.emoji.identifier);
 if (!r?.count && r) r.count = 1;

 scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 2000), () => {
  log(reaction, user, msg);
 });
 reactionRoles(reaction, user, msg);
 votePunish(reaction, user, msg);
};
