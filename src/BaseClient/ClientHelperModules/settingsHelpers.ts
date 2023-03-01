import * as Discord from 'discord.js';
import type * as DBT from '../../Typings/DataBaseTypings';
import type * as CT from '../../Typings/CustomTypings';
import stringEmotes from './stringEmotes.js';
import objectEmotes from './objectEmotes.js';
import moment from './moment.js';
import query from './query.js';
import constants from '../Other/constants.js';

type SettingsNames = CT.Language['slashCommands']['settings']['categories'];
type FieldName<T extends keyof SettingsNames> = SettingsNames[T]['fields'];

const embedParsers = {
  author: <T extends keyof SettingsNames>(language: CT.Language, lan: SettingsNames[T]) => ({
    icon_url: objectEmotes.settings.link,
    name: language.slashCommands.settings.authorType(lan.name),
    url: constants.standard.invite,
  }),
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
};

const buttonParsers = {
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
  ): Discord.APIButtonComponent => {
    const constantTypes =
      constants.commands.settings.types[
        settingName as keyof typeof constants.commands.settings.types
      ];

    return {
      type: Discord.ComponentType.Button,
      label: (
        (language.slashCommands.settings.categories[settingName].fields as FieldName<T>)[
          name
        ] as Record<string, string>
      ).name,
      style:
        (typeof setting !== 'boolean' && setting?.length) || !!setting
          ? Discord.ButtonStyle.Primary
          : Discord.ButtonStyle.Secondary,
      custom_id: `settings/${constantTypes[name as keyof typeof constantTypes]}_${String(
        name,
      )}_${settingName}`,
      emoji: (type ? getEmoji(setting, `wl${type}s`) : undefined) ?? emoji,
    };
  },
  boolean: <T extends keyof SettingsNames>(
    language: CT.Language,
    setting: boolean | undefined,
    name: keyof FieldName<T>,
    settingName: T,
  ): Discord.APIButtonComponent => {
    const constantTypes =
      constants.commands.settings.types[
        settingName as keyof typeof constants.commands.settings.types
      ];

    return {
      type: Discord.ComponentType.Button,
      label: (
        (language.slashCommands.settings.categories[settingName].fields as FieldName<T>)[
          name
        ] as Record<'name', string>
      ).name,
      style: !!setting ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Secondary,
      custom_id: `settings/${constantTypes[name as keyof typeof constantTypes]}_${String(
        name,
      )}_${settingName}`,
      emoji: setting ? objectEmotes.enabled : objectEmotes.disabled,
    };
  },
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
};

const multiRowHelpers = {
  noFields: (embeds: Discord.APIEmbed[], language: CT.Language) => {
    if (!embeds[0].fields?.length) {
      embeds[0].fields?.push({
        name: '\u200b',
        value: language.slashCommands.settings.noFields,
        inline: false,
      });
    }
  },
  options: (
    language: CT.Language,
    name: string,
  ): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => [
    {
      type: Discord.ComponentType.ActionRow,
      components: [buttonParsers.delete(language, name), buttonParsers.create(language, name)],
    },
  ],
  components: (
    embeds: Discord.APIEmbed[],
    components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[],
    language: CT.Language,
    name: string,
  ) => {
    if (Number(embeds[0].fields?.length) > 25) {
      components.unshift({
        type: Discord.ComponentType.ActionRow,
        components: [
          buttonParsers.previous(language, name),
          buttonParsers.next(language, name, true),
        ],
      });
    }
  },
  embeds: <T extends keyof SettingsNames>(
    fields:
      | {
          name: string;
          value: string;
        }[]
      | undefined,
    language: CT.Language,
    lan: SettingsNames[T],
  ): Discord.APIEmbed[] => [
    {
      author: embedParsers.author(language, lan),
      fields: fields?.splice(0, 24) ?? [],
    },
  ],
};

export const updateLog = (
  oldSetting: typeof DBT.Res,
  newSetting: typeof DBT.Res,
  changedSetting: string,
  setting: string,
  uniquetimestamp?: number,
) => {
  console.log(oldSetting, newSetting, changedSetting, setting, uniquetimestamp);
};

const changeHelpers = {
  changeModal: <T extends keyof SettingsNames>(
    language: CT.Language,
    lan: CT.Language['slashCommands']['settings']['categories'][T],
    settingName: T,
    fieldName: string,
    type: 'number',
    current: string | undefined,
    short: boolean,
    uniquetimestamp?: number,
  ): Discord.APIModalInteractionResponseCallbackData => ({
    title: (lan.fields[fieldName as keyof typeof lan.fields] as Record<string, string>).name,
    custom_id: `settings/${type}_${settingName}${uniquetimestamp ? `_${uniquetimestamp}` : ''}`,
    components: [
      {
        type: Discord.ComponentType.ActionRow,
        components: [
          {
            type: Discord.ComponentType.TextInput,
            style: Discord.TextInputStyle.Paragraph,
            label: language.slashCommands.settings.acceptedValue,
            custom_id: '-',
            placeholder: (
              lan.fields[fieldName as keyof typeof lan.fields] as Record<string, string>
            ).desc,
            value: (lan.fields[fieldName as keyof typeof lan.fields] as Record<string, string>)
              .desc,
            max_length: (lan.fields[fieldName as keyof typeof lan.fields] as Record<string, string>)
              .desc.length,
            min_length: (lan.fields[fieldName as keyof typeof lan.fields] as Record<string, string>)
              .desc.length,
          },
        ],
      },
      {
        type: Discord.ComponentType.ActionRow,
        components: [
          {
            type: Discord.ComponentType.TextInput,
            style: short ? Discord.TextInputStyle.Short : Discord.TextInputStyle.Paragraph,
            label: language.slashCommands.settings.insertHere,
            value: current ?? undefined,
            custom_id: fieldName,
          },
        ],
      },
    ],
  }),
  modal: <T extends keyof SettingsNames>(
    name: T,
    fieldName: string,
  ): Discord.APIButtonComponent => ({
    type: Discord.ComponentType.Button,
    style: Discord.ButtonStyle.Danger,
    custom_id: `settings/modal_${name}_${fieldName}`,
    emoji: objectEmotes.back,
  }),
  back: <T extends keyof SettingsNames>(name: T): Discord.APIButtonComponent => ({
    type: Discord.ComponentType.Button,
    style: Discord.ButtonStyle.Danger,
    custom_id: `settings/${name}`,
    emoji: objectEmotes.back,
  }),
  get: (
    tableName: keyof SettingsNames,
    fieldName: string,
    guildId: string | null,
    uniquetimestamp?: number,
  ) =>
    (uniquetimestamp
      ? query(`SELECT ${fieldName} FROM ${tableName} WHERE uniquetimestamp = $1;`, [
          uniquetimestamp,
        ])
      : query(`SELECT ${fieldName} FROM ${tableName} WHERE guildid = $1;`, [guildId])
    ).then((r: any[] | null) => {
      if (!r) {
        if (uniquetimestamp) {
          return query(
            `INSERT INTO ${tableName} (guildid, uniquetimestamp) VALUES ($1) RETURNING ${fieldName};`,
            [guildId, Date.now()],
          ).then((r: any[] | null) => (r ? r[0] : null));
        } else {
          return query(`INSERT INTO ${tableName} (guildid) VALUES ($1) RETURNING ${fieldName};`, [
            guildId,
          ]).then((r: any[] | null) => (r ? r[0] : null));
        }
      }

      return r ? r[0] : null;
    }),
  getAndInsert: (
    tableName: keyof SettingsNames,
    fieldName: string,
    guildId: string | null,
    newSetting: any,
    uniquetimestamp?: number,
  ) =>
    uniquetimestamp
      ? query(`UPDATE ${tableName} SET ${fieldName} = $1 WHERE uniquetimestamp = $2 RETURNING *;`, [
          uniquetimestamp,
        ]).then((r: any[] | null) => (r ? r[0] : null))
      : query(`UPDATE ${tableName} SET ${fieldName} = $1 WHERE guildid = $2 RETURNING *;`, [
          newSetting,
          guildId,
        ]).then((r: any[] | null) => (r ? r[0] : null)),
};

export default {
  embedParsers,
  buttonParsers,
  multiRowHelpers,
  updateLog,
  changeHelpers,
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
