import type * as Discord from 'discord.js';
import reply from './replyMsg.js';
import objectEmotes from '../Other/ObjectEmotes.json' assert { type: 'json' };
import constants from '../Other/Constants.js';
import type CT from '../../Typings/CustomTypings';

export default (
  msg: Discord.Message,
  content: string,
  language: CT.Language,
  m?: Discord.Message,
) => {
  const embed: Discord.APIEmbed = {
    author: {
      name: language.error,
      icon_url: objectEmotes.warning.link,
      url: constants.standard.invite,
    },
    color: constants.colors.warning,
    description: content,
  };

  if (m) return m.edit({ embeds: [embed] }).catch(() => null);

  return reply(msg, { embeds: [embed] });
};
