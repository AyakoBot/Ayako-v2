import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';

export default (
  msg:
    | Discord.Message
    | CT.Message
    | Discord.MessageReference
    | { guildId?: string; channelId: string; id: string },
) =>
  `https://discord.com/channels/${'guild' in msg && msg.guild?.id ? msg.guild.id : '@me'}/${
    msg.channelId
  }/${'id' in msg ? msg.id : msg.messageId}`;
