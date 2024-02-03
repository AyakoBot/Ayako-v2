import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Typings.js';
import type * as S from '../../../../Typings/Settings.js';

export default async <T extends keyof typeof S.SettingsName2TableName>(
 language: CT.Language,
 settingName: T,
 fieldName: string,
 values: string[] | string | undefined,
 type: S.MentionTypes,
 guild: Discord.Guild,
): Promise<Discord.APIEmbed> => ({
 author: {
  name: language.slashCommands.settings.authorType(
   language.slashCommands.settings.categories[settingName].name,
  ),
  icon_url: language.client.util.emotes.settings.link,
 },
 title: language.slashCommands.settings.previouslySet,
 description: `${
  (
   await Promise.all(
    (Array.isArray(values) ? values : [values])
     .map((v) =>
      v
       ? language.client.util.importCache.BaseClient.UtilModules.settingsHelpers.getMention.file.default(
          language,
          type,
          v,
          guild,
         )
       : null,
     )
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
    )?.desc ??
    language.client.util.importCache.BaseClient.UtilModules.settingsHelpers.getGlobalDesc.file.default(
     fieldName as S.GlobalDescType | S.AutoModEditorType,
     language,
    ),
  },
 ],
 color: language.client.util.CT.Colors.Ephemeral,
});
