import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import emotes from '../../emotes.js';

import getGlobalDesc from '../getGlobalDesc.js';
import getMention from '../getMention.js';

export default async <T extends keyof typeof CT.SettingsName2TableName>(
 language: CT.Language,
 settingName: T,
 fieldName: string,
 values: string[] | string | undefined,
 type: CT.MentionTypes,
 guild: Discord.Guild,
): Promise<Discord.APIEmbed> => ({
 author: {
  name: language.slashCommands.settings.authorType(
   language.slashCommands.settings.categories[settingName].name,
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
  ).join(', ') || language.t.None
 }`,
 fields: [
  {
   name: '\u200b',
   value:
    (
     language.slashCommands.settings.categories[settingName].fields[fieldName as never] as Record<
      string,
      string
     >
    )?.desc ?? getGlobalDesc(fieldName as CT.GlobalDescType | CT.AutoModEditorType, language),
  },
 ],
 color: CT.Colors.Ephemeral,
});
