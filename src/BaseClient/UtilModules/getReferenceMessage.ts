import * as Discord from 'discord.js';

export default async (reference: Discord.MessageReference | null) => {
 if (!reference) return undefined;
 if (!reference.messageId) return undefined;

 const { default: client } = await import('../Bot/Client.js');

 return client.util.getMessage(
  client.util.constants.standard.msgurl(
   reference.guildId,
   reference.channelId,
   reference.messageId,
  ),
 );
};
