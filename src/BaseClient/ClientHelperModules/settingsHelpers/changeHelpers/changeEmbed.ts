import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import constants from '../../../Other/constants.js';
import emotes from '../../emotes.js';

import getMention from '../getMention.js';
import getGlobalDesc from '../getGlobalDesc.js';

export default async <T extends keyof CT.SettingsNames>(
 language: CT.Language,
 settingName: T,
 fieldName: string,
 values: string[] | string | undefined,
 type: CT.MentionTypes,
 guild: Discord.Guild,
): Promise<Discord.APIEmbed> => ({
 author: {
  name: language.slashCommands.settings.authorType(
   language.slashCommands.settings.categories[
    String(settingName) as keyof typeof language.slashCommands.settings.categories
   ].name,
  ),
  icon_url: emotes.settings.link,
 },
 title: language.slashCommands.settings.previouslySet,
 description: `${
  (
   await Promise.all(
    (Array.isArray(values) ? values : [values])
     .map((v) => (v ? getMention(language, type, v, guild) : null))
     .filter((v): v is Promise<string> => !!v),
   )
  ).join(', ') || language.None
 }`,
 fields: [
  {
   name: '\u200b',
   value:
    (
     language.slashCommands.settings.categories[
      String(settingName) as keyof typeof language.slashCommands.settings.categories
     ].fields[fieldName as never] as Record<string, string>
    )?.desc ?? getGlobalDesc(fieldName as CT.BLWLType, language),
  },
 ],
 color: constants.colors.ephemeral,
});
