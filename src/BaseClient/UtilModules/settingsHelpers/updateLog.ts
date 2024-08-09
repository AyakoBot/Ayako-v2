import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import getLogChannels from '../getLogChannels.js';
import send from '../send.js';
import { makeCodeBlock } from '../util.js';

import postUpdate from './postUpdate.js';

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
export default async <T extends keyof typeof CT.SettingsName2TableName>(
 oldSetting: { [key in keyof CT.FieldName<T>]: unknown } | undefined,
 newSetting: { [key in keyof CT.FieldName<T>]: unknown } | undefined,
 changedSetting: keyof CT.FieldName<T>,
 settingName: T,
 uniquetimestamp: number | string | undefined,
 guild: Discord.Guild,
 language: CT.Language,
 lan: CT.Categories[T],
) => {
 postUpdate(oldSetting, newSetting, changedSetting, settingName, guild, uniquetimestamp);

 const logs = await getLogChannels('settingslog', guild);
 if (!logs) return;

 const getColor = () => {
  switch (true) {
   case !oldSetting:
    return CT.Colors.Success;
   case !newSetting:
    return CT.Colors.Danger;
   default:
    return CT.Colors.Loading;
  }
 };

 const field =
  (lan.fields[changedSetting as keyof typeof lan.fields] as { name: string }) ??
  ({
   name:
    language.slashCommands.settings[
     changedSetting as keyof CT.Language['slashCommands']['settings']
    ] ??
    lan[changedSetting as keyof typeof lan] ??
    language.slashCommands.settings.BLWL[
     changedSetting as keyof typeof language.slashCommands.settings.BLWL
    ],
  } as { name: string });

 const getFields = (): Discord.APIEmbedField[] => {
  switch (true) {
   case !oldSetting:
    return [
     {
      name: language.slashCommands.settings.create,
      value: language.slashCommands.settings.log.created(String(settingName)),
     },
    ];
   case !newSetting:
    return [
     {
      name: language.slashCommands.settings.delete,
      value: language.slashCommands.settings.log.deleted(String(settingName)),
     },
    ];
   default:
    return [
     {
      name: language.t.Before,
      value: makeCodeBlock(
       (typeof oldSetting?.[changedSetting] === 'string' ||
        Array.isArray(oldSetting?.[changedSetting])) &&
        (oldSetting?.[changedSetting] as string[] | string).length
        ? filterTokens(oldSetting?.[changedSetting] as string, guild)
        : filterTokens(oldSetting?.[changedSetting] as string, guild),
      ),
      inline: false,
     },
     {
      name: language.t.After,
      value: makeCodeBlock(
       (typeof newSetting?.[changedSetting] === 'string' ||
        Array.isArray(newSetting?.[changedSetting])) &&
        (newSetting?.[changedSetting] as string[] | string).length
        ? filterTokens(newSetting?.[changedSetting] as string, guild)
        : filterTokens(newSetting?.[changedSetting] as string, guild),
      ),
      inline: false,
     },
    ];
  }
 };

 const embed: Discord.APIEmbed = {
  color: getColor(),
  description: language.slashCommands.settings.log.desc(field.name ?? '-', lan.name),
  fields: getFields(),
  footer: {
   text: `ID: ${(Number.isNaN(uniquetimestamp) ? language.t.None : uniquetimestamp?.toString(36)) || language.t.None}`,
  },
 };

 send({ id: logs, guildId: guild.id }, { embeds: [embed] });
};

const filterTokens = (str: string, guild: Discord.Guild) => {
 if (typeof str !== 'string') return str;
 if (!str.includes('.')) return str;

 const sepByDot = str.split('.');
 if (sepByDot.length !== 3) return str;

 const [first, second, third] = sepByDot;
 if (![22, 24, 26].includes(first.length)) return str;
 if (second.length !== 6) return str;
 if (third.length !== 38) return str;

 const id = guild.client.util.getBotIdFromToken(str);
 if (!id) return str;
 if (!id.match(/\d{17,19}/gm)?.length) return str;
 return `${first}.${'*'.repeat(second.length)}.${'*'.repeat(third.length)}`;
};
