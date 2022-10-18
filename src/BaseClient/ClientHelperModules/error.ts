import type DDeno from 'discordeno';
import reply from './reply';
import client from '../DDenoClient';
import objectEmotes from '../Other/ObjectEmotes.json' assert { type: 'json' };
import constants from '../Other/Constants.json' assert { type: 'json' };

export default (
  msg: DDeno.Message | DDeno.Interaction,
  content: string,
  language: typeof import('../../Languages/en.json'),
  m?: DDeno.Message,
) => {
  const embed: DDeno.Embed = {
    author: {
      name: language.error,
      iconUrl: objectEmotes.warning.link,
      url: constants.standard.invite,
    },
    color: constants.colors.warning,
    description: content,
  };

  if (!('jumpLink' in msg)) {
    return reply(msg, { embeds: [embed], flags: 64 });
  }

  if (m) {
    return client.helpers.editMessage(m.channelId, m.id, { embeds: [embed] }).catch(() => null);
  }
  return reply(msg, { embeds: [embed] });
};
