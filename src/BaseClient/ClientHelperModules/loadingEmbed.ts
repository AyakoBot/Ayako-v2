import type * as Discord from 'discord.js';
import emotes from './emotes.js';
import constants from '../Other/constants.js';
import type CT from '../../Typings/CustomTypings.js';

export default ({
 lan,
 language,
}: {
 language: CT.Language;
 lan: { author: string; loading?: string };
}): Discord.APIEmbed => ({
 author: {
  name: lan.author,
  icon_url: emotes.loading.link,
  url: constants.standard.invite,
 },
 color: constants.colors.loading,
 description: `${constants.standard.getEmote(emotes.loading)} ${
  lan.loading ? lan.loading : language.loading
 }`,
});
