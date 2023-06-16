import type * as Discord from 'discord.js';
import colorSelector from './colorSelector.js';
import stringEmotes from './stringEmotes.js';
import objectEmotes from './objectEmotes.js';
import constants from '../Other/constants.js';
import type CT from '../../Typings/CustomTypings';

export default (
 guild: Discord.Guild,
 {
  lan,
  language,
 }: {
  language: CT.Language;
  lan: { author: string; loading?: string };
 },
): Discord.APIEmbed => ({
 author: {
  name: lan.author,
  icon_url: objectEmotes.loading.link,
  url: constants.standard.invite,
 },
 color: colorSelector(guild.members.me ?? undefined),
 description: `${stringEmotes.loading} ${lan.loading ? lan.loading : language.loading}`,
});
