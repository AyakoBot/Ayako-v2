import * as Discord from 'discord.js';
import stringEmotes from '../Other/StringEmotes.json' assert { type: 'json' };
import objectEmotes from '../Other/ObjectEmotes.json' assert { type: 'json' };
import type * as CT from '../../Typings/CustomTypings';
import type * as DBT from '../../Typings/DataBaseTypings';
import moment from './moment.js';
import query from './query.js';

type SettingsNames = CT.Language['slashCommands']['settings']['categories'];
type FieldName<T extends keyof SettingsNames> = SettingsNames[T]['fields'] & {
  [key: string]: { name: string };
};

export default {
  embedParsers: {
    boolean: (val: boolean | undefined, language: CT.Language) =>
      val
        ? `${stringEmotes.enabled} ${language.Enabled}`
        : `${stringEmotes.disabled} ${language.Disabled}`,
    channels: (val: string[] | undefined, language: CT.Language) =>
      val?.length ? val.map((c) => `<#${c}>`).join(', ') : language.none,
    roles: (val: string[] | undefined, language: CT.Language) =>
      val?.length ? val.map((c) => `<@&${c}>`).join(', ') : language.none,
    users: (val: string[] | undefined, language: CT.Language) =>
      val?.length ? val.map((c) => `<@${c}>`).join(', ') : language.none,
    channel: (val: string | undefined, language: CT.Language) =>
      val?.length ? `<#${val}>` : language.none,
    role: (val: string | undefined, language: CT.Language) =>
      val?.length ? `<@&${val}>` : language.none,
    user: (val: string | undefined, language: CT.Language) =>
      val?.length ? `<@${val}>` : language.none,
    number: (val: string | number | undefined, language: CT.Language) =>
      val ? String(val) : language.none,
    time: (val: number | undefined, language: CT.Language) =>
      val ? moment(val, language) : language.none,
    embed: async (val: string | undefined, language: CT.Language) =>
      val
        ? (
            await query(`SELECT * FROM customembeds WHERE uniquetimestamp = $1;`, [val]).then(
              (r: DBT.customembeds[] | null) => (r ? r[0] : null),
            )
          )?.name ?? language.none
        : language.none,
  },
  buttonParsers: {
    global: (
      language: CT.Language,
      setting: boolean | string[] | undefined,
      settingName: string,
      type?: 'blchannel' | 'blrole' | 'bluser' | 'wlchannel' | 'wlrole' | 'wluser',
    ): Discord.APIButtonComponent => ({
      type: Discord.ComponentType.Button,
      label: getLabel(language, type),
      style: getStyle(setting),
      custom_id: `settings/${type ?? 'active'}_${settingName}`,
      emoji: getEmoji(setting, type),
    }),
    specific: <T extends keyof SettingsNames>(
      language: CT.Language,
      setting: string[] | string | boolean | undefined,
      name: keyof FieldName<T>,
      settingName: T,
      type?: 'channel' | 'role' | 'user',
    ): Discord.APIButtonComponent => ({
      type: Discord.ComponentType.Button,
      label: (language.slashCommands.settings.categories[settingName].fields as FieldName<T>)[name]
        .name,
      style:
        (typeof setting !== 'boolean' && setting?.length) || !!setting
          ? Discord.ButtonStyle.Primary
          : Discord.ButtonStyle.Secondary,
      custom_id: `settings/${String(name)}_${setting}`,
      emoji: type ? getEmoji(setting, `wl${type}`) : undefined,
    }),
  },
};

const getEmoji = (
  setting: string | boolean | string[] | undefined,
  type?: 'blchannel' | 'blrole' | 'bluser' | 'wlchannel' | 'wlrole' | 'wluser',
) => {
  switch (type) {
    case 'blchannel':
    case 'wlchannel': {
      return objectEmotes.channelTypes[0];
    }
    case 'blrole':
    case 'wlrole': {
      return objectEmotes.Role;
    }
    case 'bluser':
    case 'wluser': {
      return objectEmotes.Member;
    }
    default: {
      return setting ? objectEmotes.enabled : objectEmotes.disabled;
    }
  }
};

const getLabel = (
  language: CT.Language,
  type?: 'blchannel' | 'blrole' | 'bluser' | 'wlchannel' | 'wlrole' | 'wluser',
) => {
  if (type) return language.slashCommands.settings[type];
  return language.slashCommands.settings.active;
};

const getStyle = (setting: boolean | string | string[] | undefined) => {
  if (typeof setting === 'boolean' || !setting) {
    return setting ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger;
  }
  return setting?.length ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Secondary;
};
