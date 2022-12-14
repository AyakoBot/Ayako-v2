import type DDeno from 'discordeno';
import constants from '../Other/Constants.js';
import client from '../DDenoClient.js';
import type CT from '../../Typings/CustomTypings';

export default (msg: DDeno.Message, language: CT.Language) => {
  const embed: DDeno.Embed = {
    description: language.errors.time,
    color: constants.colors.warning,
  };

  return client.helpers.editMessage(msg.channelId, msg.id, { embeds: [embed], components: [] });
};
