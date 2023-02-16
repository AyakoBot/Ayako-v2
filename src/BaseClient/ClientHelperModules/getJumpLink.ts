import type * as Discord from 'discord.js';

export default (
  msg:
    | Discord.Message
    | Discord.Message
    | Discord.MessageReference
    | { guildId?: string; channelId: string; id: string },
) =>
  `https://discord.com/channels/${'guild' in msg && msg.guild?.id ? msg.guildId : '@me'}/${
    msg.channelId
  }/${'id' in msg ? msg.id : msg.messageId}`;
