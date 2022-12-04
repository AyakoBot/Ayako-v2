import type * as DDeno from 'discordeno';
import type CT from '../../Typings/CustomTypings';

export default (msg: DDeno.Message | CT.Message) =>
  `https://discord.com/channels/${'guildId' in msg && msg.guildId ? msg.guildId : '@me'}/${
    msg.channelId
  }/${msg.id}`;
