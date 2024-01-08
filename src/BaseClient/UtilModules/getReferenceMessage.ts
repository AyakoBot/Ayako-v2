import * as Discord from 'discord.js';
import constants from '../Other/constants.js';
import getMessage from './getMessage.js';

export default async (reference: Discord.MessageReference | null) => {
 if (!reference) return undefined;
 if (!reference.messageId) return undefined;

 return getMessage(
  constants.standard.msgurl(reference.guildId, reference.channelId, reference.messageId),
 );
};
