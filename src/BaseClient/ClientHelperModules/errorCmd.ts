import type * as Discord from 'discord.js';
import reply from './replyCmd.js';
import objectEmotes from './objectEmotes.js';
import constants from '../Other/constants.js';
import type CT from '../../Typings/CustomTypings';

export default (
  cmd: Discord.ButtonInteraction | Discord.CommandInteraction | Discord.AnySelectMenuInteraction,
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
    color: constants.colors.danger,
    description: content,
  };

  if (m && m.editable) return m.edit({ embeds: [embed] }).catch(() => null);

  return reply(cmd, { embeds: [embed], ephemeral: true });
};
