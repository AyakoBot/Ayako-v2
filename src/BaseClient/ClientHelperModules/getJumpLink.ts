import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';

export default (
  msg: Discord.Message | CT.Message | { guildId?: bigint; channelId: bigint; id: bigint },
) =>
  `https://discord.com/channels/${'guildId' in msg && msg.guildId ? msg.guildId : '@me'}/${
    msg.channelId
  }/${msg.id}`;
