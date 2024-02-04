import type * as Discord from 'discord.js';

export default async (reaction: Discord.MessageReaction, user: Discord.User) => {
 if (!reaction.message.guild) return;

 await reaction.client.util.firstGuildInteraction(reaction.message.guild);

 const msg = await reaction.client.util.request.channels
  .getMessage(reaction.message.channel as Discord.GuildTextBasedChannel, reaction.message.id)
  .then((m) => ('message' in m ? undefined : m));
 if (!msg) return;

 user.client.util.importCache.Events.BotEvents.messageEvents.messageReactionRemove.log.file.default(
  reaction,
  user,
  msg,
 );
 user.client.util.importCache.Events.BotEvents.messageEvents.messageReactionRemove.reactionRoles.file.default(
  reaction,
  user,
  msg,
 );
};
