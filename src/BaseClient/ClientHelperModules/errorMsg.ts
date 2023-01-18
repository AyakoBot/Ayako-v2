import type DDeno from 'discordeno';
import reply from './replyMsg.js';
import objectEmotes from '../Other/ObjectEmotes.json' assert { type: 'json' };
import constants from '../Other/Constants.js';
import client from '../Client.js';
import type CT from '../../Typings/CustomTypings';

export default (msg: DDeno.Message, content: string, language: CT.Language, m?: DDeno.Message) => {
  const embed: DDeno.Embed = {
    author: {
      name: language.error,
      iconUrl: objectEmotes.warning.link,
      url: constants.standard.invite,
    },
    color: constants.colors.warning,
    description: content,
  };

  if (m) {
    return client.helpers.editMessage(m.channelId, m.id, { embeds: [embed] }).catch(() => null);
  }

  return reply(msg, { embeds: [embed] });
};
