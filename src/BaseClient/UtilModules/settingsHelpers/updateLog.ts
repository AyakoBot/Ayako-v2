import * as Discord from 'discord.js';
import type * as S from '../../../Typings/Settings.js';
import type * as CT from '../../../Typings/Typings.js';

/**
 * Updates the settings log with the old and new settings and sends an embed to the log channel.
 * @param oldSetting - The old setting object.
 * @param newSetting - The new setting object.
 * @param changedSetting - The key of the changed setting.
 * @param settingName - The name of the setting.
 * @param uniquetimestamp - The unique timestamp.
 * @param guild - The guild object.
 * @param language - The language object.
 * @param lan - The settings language object.
 */
export default async <T extends keyof typeof S.SettingsName2TableName>(
 oldSetting: { [key in keyof S.FieldName<T>]: unknown } | undefined,
 newSetting: { [key in keyof S.FieldName<T>]: unknown } | undefined,
 changedSetting: keyof S.FieldName<T>,
 settingName: T,
 uniquetimestamp: number | string | undefined,
 guild: Discord.Guild,
 language: CT.Language,
 lan: S.Categories[T],
) => {
 language.client.util.importCache.BaseClient.UtilModules.settingsHelpers.postUpdate.file.default(
  oldSetting,
  newSetting,
  changedSetting,
  settingName,
  guild,
  uniquetimestamp,
 );

 const logs = await language.client.util.getLogChannels('settingslog', guild);
 if (!logs) return;

 const getColor = () => {
  switch (true) {
   case !oldSetting: {
    return language.client.util.CT.Colors.Success;
   }
   case !newSetting: {
    return language.client.util.CT.Colors.Danger;
   }
   default: {
    return language.client.util.CT.Colors.Loading;
   }
  }
 };

 const field =
  (lan.fields[changedSetting as keyof typeof lan.fields] as { name: string }) ??
  ({
   name:
    language.slashCommands.settings[
     changedSetting as keyof CT.Language['slashCommands']['settings']
    ] ?? lan[changedSetting as keyof typeof lan],
  } as { name: string });

 const getFields = (): Discord.APIEmbedField[] => {
  switch (true) {
   case !oldSetting: {
    return [
     {
      name: language.slashCommands.settings.create,
      value: language.slashCommands.settings.log.created(String(settingName)),
     },
    ];
   }
   case !newSetting: {
    return [
     {
      name: language.slashCommands.settings.delete,
      value: language.slashCommands.settings.log.deleted(String(settingName)),
     },
    ];
   }
   default: {
    return [
     {
      name: language.t.Before,
      value: `${language.client.util.util.makeInlineCode(field.name)}:\n${
       oldSetting?.[changedSetting] && oldSetting?.[changedSetting]
        ? language.client.util.util.makeCodeBlock((oldSetting?.[changedSetting] as string) ?? ' ')
        : language.t.None
      }`,
      inline: false,
     },
     {
      name: language.t.After,
      value: `${language.client.util.util.makeInlineCode(field.name)}:\n${
       newSetting?.[changedSetting] && newSetting?.[changedSetting]
        ? language.client.util.util.makeCodeBlock((newSetting?.[changedSetting] as string) ?? ' ')
        : language.t.None
      }`,
      inline: false,
     },
    ];
   }
  }
 };

 const embed: Discord.APIEmbed = {
  color: getColor(),
  description: language.slashCommands.settings.log.desc(field.name, lan.name),
  fields: getFields(),
 };

 language.client.util.send({ id: logs, guildId: guild.id }, { embeds: [embed] });
};
