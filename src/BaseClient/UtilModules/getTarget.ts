import * as Discord from 'discord.js';
import constants from '../Other/constants.js';
import getReferenceMessage from './getReferenceMessage.js';
import { request } from './requestHandler.js';
import emotes from './emotes.js';
import getUser from './getUser.js';
import error from './error.js';

export default async (msg: Discord.Message<true>, args: string[]) => {
 let user = msg.mentions.users.first();

 if (msg.reference && user?.id === (await getReferenceMessage(msg.reference))?.author.id) {
  return react(msg);
 }

 if (!user) {
  if (!args?.length) return react(msg);

  user = await getUser(args[0]);
 }

 if (!user) return react(msg);

 return user;
};

const react = async (msg: Discord.Message<true>) => {
 const reaction = await request.channels.addReaction(
  msg,
  constants.standard.getEmoteIdentifier(emotes.cross),
 );

 if (typeof reaction !== 'undefined') error(msg.guild, new Error(reaction.message));
 return undefined;
};
