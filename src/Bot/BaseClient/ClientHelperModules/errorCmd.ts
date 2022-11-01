import type DDeno from 'discordeno';
import reply from './replyCmd.js';
import objectEmotes from '../Other/ObjectEmotes.json' assert { type: 'json' };
import constants from '../Other/Constants.json' assert { type: 'json' };
import client from '../DDenoClient.js';
import type CT from '../../Typings/CustomTypings';

export default (
  msg: DDeno.Interaction,
  content: string,
  language: CT.Language,
  type: DDeno.InteractionResponseTypes,
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

  if (m) {
    return client.helpers.editMessage(m.channelId, m.id, { embeds: [embed] }).catch(() => null);
  }

  return reply(msg, { data: { embeds: [embed] }, type });
};
