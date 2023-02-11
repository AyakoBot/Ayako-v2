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
      type: 'blchannels' | 'blroles' | 'blusers' | 'wlchannels' | 'wlroles' | 'wlusers' | 'active',
      settingName: string,
    ): Discord.APIButtonComponent => ({
      type: Discord.ComponentType.Button,
      label: getLabel(language, type),
      style: getStyle(setting),
      custom_id: `settings/${type}_${settingName}`,
      emoji: getEmoji(setting, type),
    }),
    specific: <T extends keyof SettingsNames>(
      language: CT.Language,
      setting: string[] | string | boolean | undefined,
      name: keyof FieldName<T>,
      settingName: T,
      type?: 'channel' | 'role' | 'user',
      emoji?: Discord.APIMessageComponentEmoji,
    ): Discord.APIButtonComponent => ({
      type: Discord.ComponentType.Button,
      label: (language.slashCommands.settings.categories[settingName].fields as FieldName<T>)[name]
        .name,
      style:
        (typeof setting !== 'boolean' && setting?.length) || !!setting
          ? Discord.ButtonStyle.Primary
          : Discord.ButtonStyle.Secondary,
      custom_id: `settings/${String(name)}_${setting}`,
      emoji: (type ? getEmoji(setting, `wl${type}s`) : undefined) ?? emoji,
    }),
    boolean: <T extends keyof SettingsNames>(
      language: CT.Language,
      setting: boolean | undefined,
      name: keyof FieldName<T>,
      settingName: T,
    ): Discord.APIButtonComponent => ({
      type: Discord.ComponentType.Button,
      label: (language.slashCommands.settings.categories[settingName].fields as FieldName<T>)[name]
        .name,
      style: !!setting ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Secondary,
      custom_id: `settings/${String(name)}_${setting}`,
      emoji: setting ? objectEmotes.enabled : objectEmotes.disabled,
    }),
    create: (language: CT.Language, name: string): Discord.APIButtonComponent => ({
      type: Discord.ComponentType.Button,
      label: language.slashCommands.settings.create,
      style: Discord.ButtonStyle.Success,
      custom_id: `settings/create_${name}`,
      emoji: objectEmotes.plusBG,
    }),
    delete: (language: CT.Language, name: string): Discord.APIButtonComponent => ({
      type: Discord.ComponentType.Button,
      label: language.slashCommands.settings.delete,
      style: Discord.ButtonStyle.Danger,
      custom_id: `settings/delete_${name}`,
      emoji: objectEmotes.minusBG,
    }),
    previous: (
      language: CT.Language,
      name: string,
      enabled: boolean = false,
    ): Discord.APIButtonComponent => ({
      type: Discord.ComponentType.Button,
      label: language.slashCommands.settings.previous,
      style: Discord.ButtonStyle.Success,
      custom_id: `settings/create_${name}`,
      emoji: objectEmotes.plusBG,
      disabled: !enabled,
    }),
    next: (
      language: CT.Language,
      name: string,
      enabled: boolean = false,
    ): Discord.APIButtonComponent => ({
      type: Discord.ComponentType.Button,
      label: language.slashCommands.settings.next,
      style: Discord.ButtonStyle.Success,
      custom_id: `settings/delete_${name}`,
      emoji: objectEmotes.minusBG,
      disabled: !enabled,
    }),
  },
};

const getEmoji = (
  setting: string | boolean | string[] | undefined,
  type?: 'blchannels' | 'blroles' | 'blusers' | 'wlchannels' | 'wlroles' | 'wlusers' | 'active',
) => {
  switch (type) {
    case 'blchannels':
    case 'wlchannels': {
      return objectEmotes.channelTypes[0];
    }
    case 'blroles':
    case 'wlroles': {
      return objectEmotes.Role;
    }
    case 'blusers':
    case 'wlusers': {
      return objectEmotes.Member;
    }
    default: {
      return setting ? objectEmotes.enabled : objectEmotes.disabled;
    }
  }
};

const getLabel = (
  language: CT.Language,
  type: 'blchannels' | 'blroles' | 'blusers' | 'wlchannels' | 'wlroles' | 'wlusers' | 'active',
) => {
  if (type && type !== 'active') {
    return language.slashCommands.settings[
      type.slice(0, -1) as 'blchannel' | 'blrole' | 'bluser' | 'wlchannel' | 'wlrole' | 'wluser'
    ];
  }
  return language.slashCommands.settings.active;
};

const getStyle = (setting: boolean | string | string[] | undefined) => {
  if (typeof setting === 'boolean' || !setting) {
    return setting ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger;
  }
  return setting?.length ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Secondary;
};
