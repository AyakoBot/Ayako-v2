import * as Discord from 'discord.js';
import constants from '../Other/constants.js';
import getReferenceMessage from './getReferenceMessage.js';
import { request } from './requestHandler.js';
import emotes from './emotes.js';
import getUser from './getUser.js';

export default async (msg: Discord.Message<true>, args: string[]) => {
 let user = msg.mentions.users.first();

 if (user?.id === (await getReferenceMessage(msg.reference))?.author.id) {
  request.channels.addReaction(msg, constants.standard.getEmoteIdentifier(emotes.cross));
  return undefined;
 }

 if (!user) {
  if (!args?.length) {
   request.channels.addReaction(msg, constants.standard.getEmoteIdentifier(emotes.cross));
   return undefined;
  }

  user = await getUser(args[0]);
 }

 if (!user) {
  request.channels.addReaction(msg, constants.standard.getEmoteIdentifier(emotes.cross));
  return undefined;
 }

 return user;
};
