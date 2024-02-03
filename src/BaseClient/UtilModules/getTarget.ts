import * as Discord from 'discord.js';

export default async (msg: Discord.Message<true>, args: string[]) => {
 let user = msg.mentions.users.first();

 if (
  msg.reference &&
  user?.id === (await msg.client.util.getReferenceMessage(msg.reference))?.author.id
 ) {
  return react(msg);
 }

 if (!user) {
  if (!args?.length) return react(msg);

  user = await msg.client.util.getUser(args[0]);
 }

 if (!user) return react(msg);

 return user;
};

const react = async (msg: Discord.Message<true>) => {
 const reaction = await msg.client.util.request.channels.addReaction(
  msg,
  msg.client.util.constants.standard.getEmoteIdentifier(msg.client.util.emotes.cross),
 );

 if (typeof reaction !== 'undefined') msg.client.util.error(msg.guild, new Error(reaction.message));
 return undefined;
};
