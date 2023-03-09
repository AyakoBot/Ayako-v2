import * as Discord from 'discord.js';
import type * as DBT from '../../Typings/DataBaseTypings';
import type * as CT from '../../Typings/CustomTypings';
import stringEmotes from './stringEmotes.js';
import objectEmotes from './objectEmotes.js';
import moment from './moment.js';
import ms from 'ms';
import query from './query.js';
import constants from '../Other/constants.js';

type SettingsNames = CT.Language['slashCommands']['settings']['categories'];
type FieldName<T extends keyof SettingsNames> = SettingsNames[T]['fields'];
type BLWLType = 'blchannelid' | 'blroleid' | 'bluserid' | 'wlchannelid' | 'wlroleid' | 'wluserid';

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
    val?.length ? val.map((c) => `<#${c}>`).join(', ') : language.None,
  roles: (val: string[] | undefined, language: CT.Language) =>
    val?.length ? val.map((c) => `<@&${c}>`).join(', ') : language.None,
  users: (val: string[] | undefined, language: CT.Language) =>
    val?.length ? val.map((c) => `<@${c}>`).join(', ') : language.None,
  channel: (val: string | undefined, language: CT.Language) =>
    val?.length ? `<#${val}>` : language.None,
  role: (val: string | undefined, language: CT.Language) =>
    val?.length ? `<@&${val}>` : language.None,
  user: (val: string | undefined, language: CT.Language) =>
    val?.length ? `<@${val}>` : language.None,
  number: (val: string | number | undefined, language: CT.Language) =>
    val ? String(val) : language.None,
  time: (val: number | undefined, language: CT.Language) =>
    val ? moment(val, language) : language.None,
  embed: async (val: string | undefined, language: CT.Language) =>
    val
      ? (
          await query(`SELECT * FROM customembeds WHERE uniquetimestamp = $1;`, [val]).then(
            (r: DBT.customembeds[] | null) => (r ? r[0] : null),
          )
        )?.name ?? language.None
      : language.None,
};

const buttonParsers = {
  global: (
    language: CT.Language,
    setting: boolean | string[] | undefined,
    type: BLWLType | 'active',
    settingName: string,
    uniquetimestamp?: string,
  ): Discord.APIButtonComponent => ({
    type: Discord.ComponentType.Button,
    label: getLabel(language, type),
    style: getStyle(setting),
    custom_id: `settings/editors/${getGlobalType(type)}_${type}_${settingName}_${uniquetimestamp}`,
    emoji: getEmoji(setting, type),
  }),
  specific: <T extends keyof SettingsNames>(
    language: CT.Language,
    setting: string[] | string | boolean | undefined,
    name: keyof FieldName<T>,
    settingName: T,
    uniquetimestamp?: string,
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
      custom_id: `settings/editors/${constantTypes[name as keyof typeof constantTypes]}_${String(
        name,
      )}_${settingName}_${uniquetimestamp}`,
      emoji: (type ? getEmoji(setting, `wl${type}id`) : undefined) ?? emoji,
    };
  },
  boolean: <T extends keyof SettingsNames>(
    language: CT.Language,
    setting: boolean | undefined,
    name: keyof FieldName<T>,
    settingName: T,
    uniquetimestamp?: string,
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
      custom_id: `settings/editors/${constantTypes[name as keyof typeof constantTypes]}_${String(
        name,
      )}_${settingName}_${uniquetimestamp}`,
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
  /*
  delete: (language: CT.Language, name: string): Discord.APIButtonComponent => ({
    type: Discord.ComponentType.Button,
    label: language.slashCommands.settings.delete,
    style: Discord.ButtonStyle.Danger,
    custom_id: `settings/delete_${name}`,
    emoji: objectEmotes.minusBG,
  }),
  */
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
    uniquetimestamp?: string,
  ): Discord.APIButtonComponent => ({
    type: Discord.ComponentType.Button,
    label: language.slashCommands.settings.next,
    style: Discord.ButtonStyle.Success,
    custom_id: `settings/delete_${name}_${uniquetimestamp}`,
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
      components: [buttonParsers.create(language, name)],
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
  changeEmbed: <T extends keyof SettingsNames>(
    language: CT.Language,
    lan: CT.Language['slashCommands']['settings']['categories'][T],
    fieldName: string,
    values: string[] | string | undefined,
    type: 'channel' | 'role' | 'user' | 'mention' | 'punishment',
  ): Discord.APIEmbed => ({
    author: {
      name: language.slashCommands.settings.authorType(lan.name),
      icon_url: objectEmotes.settings.link,
    },
    title: language.slashCommands.settings.previouslySet,
    description: `${
      (Array.isArray(values) ? values : [values])
        .map((v) => (v ? getMention(language, type, v) : null))
        .filter((v): v is string => !!v)
        .join(', ') || language.None
    }`,
    fields: [
      {
        name: '\u200b',
        value:
          (lan.fields[fieldName as keyof typeof lan.fields] as Record<string, string>)?.desc ??
          getGlobalDesc(fieldName as BLWLType, language),
      },
    ],
    color: constants.colors.ephemeral,
  }),
  changeSelectGlobal: <T extends keyof SettingsNames>(
    language: CT.Language,
    type: 'channel' | 'role' | 'user' | 'mention' | 'channels' | 'roles' | 'users' | 'mentions',
    fieldName: string,
    settingName: T,
    uniquetimestamp?: number,
  ) => {
    const menu:
      | Discord.APIRoleSelectComponent
      | Discord.APIChannelSelectComponent
      | Discord.APIUserSelectComponent
      | Discord.APIMentionableSelectComponent = {
      min_values: 0,
      max_values: type.includes('s') ? 25 : 1,
      custom_id: `settings/${type}_${fieldName}_${settingName}${
        uniquetimestamp ? `_${uniquetimestamp}` : ''
      }`,
      type: getChangeSelectType(type),
      placeholder: getPlaceholder(type, language),
    };

    if (menu.type === Discord.ComponentType.ChannelSelect) {
      menu.channel_types = [
        Discord.ChannelType.AnnouncementThread,
        Discord.ChannelType.GuildAnnouncement,
        Discord.ChannelType.GuildForum,
        Discord.ChannelType.GuildStageVoice,
        Discord.ChannelType.GuildText,
        Discord.ChannelType.GuildVoice,
        Discord.ChannelType.PrivateThread,
        Discord.ChannelType.PublicThread,
      ];
    }

    return menu;
  },
  changeSelect: <T extends keyof SettingsNames>(
    fieldName: string,
    settingName: T,
    type: string,
    options: {
      options: Discord.StringSelectMenuComponent['options'];
      placeholder?: string;
      max_values?: number;
      min_values?: number;
    },
    uniquetimestamp?: number,
  ) => {
    const menu: Discord.APIStringSelectComponent = {
      min_values: options.min_values ?? 0,
      max_values: options.max_values ?? 1,
      custom_id: `settings/${type}_${fieldName}_${settingName}${
        uniquetimestamp ? `_${uniquetimestamp}` : ''
      }`,
      type: Discord.ComponentType.StringSelect,
      options: options.options,
      placeholder: options.placeholder,
    };

    return menu;
  },
  changeModal: <T extends keyof SettingsNames>(
    language: CT.Language,
    lan: CT.Language['slashCommands']['settings']['categories'][T],
    settingName: T,
    fieldName: string,
    type: 'number' | 'duration',
    current: string | undefined,
    short: boolean,
    uniquetimestamp?: number,
  ): Discord.APIModalInteractionResponseCallbackData => ({
    title: (lan.fields[fieldName as keyof typeof lan.fields] as Record<string, string>).name,
    custom_id: `settings/${type}_${settingName}${
      uniquetimestamp ? `_${uniquetimestamp}` : ''
    }`,
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
            value:
              (type === 'duration' && current ? String(ms(Number(current) * 1000)) : current) ??
              undefined,
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
    custom_id: `settings/settingsDisplay_${name}`,
    emoji: objectEmotes.back,
  }),
  done: <T extends keyof SettingsNames>(
    name: T,
    fieldName: string,
    type: 'channel' | 'channels' | 'role' | 'roles' | 'user' | 'users' | 'punishment',
    language: CT.Language,
  ): Discord.APIButtonComponent => ({
    type: Discord.ComponentType.Button,
    style: Discord.ButtonStyle.Success,
    custom_id: `settings/done/${type}_${name}_${fieldName}`,
    label: language.Done,
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
          newSetting ?? null,
          uniquetimestamp,
        ]).then((r: any[] | null) => (r ? r[0] : null))
      : query(`UPDATE ${tableName} SET ${fieldName} = $1 WHERE guildid = $2 RETURNING *;`, [
          newSetting ?? null,
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

const getEmoji = (setting: string | boolean | string[] | undefined, type?: BLWLType | 'active') => {
  switch (type) {
    case 'blchannelid':
    case 'wlchannelid': {
      return objectEmotes.channelTypes[0];
    }
    case 'blroleid':
    case 'wlroleid': {
      return objectEmotes.Role;
    }
    case 'bluserid':
    case 'wluserid': {
      return objectEmotes.Member;
    }
    default: {
      return setting ? objectEmotes.enabled : objectEmotes.disabled;
    }
  }
};

const getLabel = (language: CT.Language, type: BLWLType | 'active') => {
  if (type && type !== 'active') {
    return language.slashCommands.settings[
      type.slice(0, -2) as 'blchannel' | 'blrole' | 'bluser' | 'wlchannel' | 'wlrole' | 'wluser'
    ];
  }
  return language.slashCommands.settings.active;
};

const getStyle = (setting: boolean | string | string[] | undefined) => {
  if (typeof setting === 'boolean' || !setting) {
    return setting ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger;
  }
  return setting?.length ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Danger;
};

const getGlobalType = (type: BLWLType | 'active') => {
  switch (true) {
    case type.includes('channel'): {
      return 'channels';
    }
    case type.includes('role'): {
      return 'roles';
    }
    case type.includes('user'): {
      return 'users';
    }
    default: {
      return 'boolean';
    }
  }
};

const getChangeSelectType = (
  type: 'channel' | 'role' | 'user' | 'mention' | 'channels' | 'roles' | 'users' | 'mentions',
) => {
  switch (type) {
    case 'channel':
    case 'channels': {
      return Discord.ComponentType.ChannelSelect;
    }
    case 'user':
    case 'users': {
      return Discord.ComponentType.UserSelect;
    }
    case 'role':
    case 'roles': {
      return Discord.ComponentType.RoleSelect;
    }
    default: {
      return Discord.ComponentType.MentionableSelect;
    }
  }
};

const getPlaceholder = (
  type: 'channel' | 'role' | 'user' | 'mention' | 'channels' | 'roles' | 'users' | 'mentions',
  language: CT.Language,
) => {
  switch (type) {
    case 'channel':
    case 'channels': {
      return language.Channels;
    }
    case 'user':
    case 'users': {
      return language.Users;
    }
    case 'role':
    case 'roles': {
      return language.Roles;
    }
    default: {
      return language.Mentionables;
    }
  }
};

const getMention = (
  language: CT.Language,
  type: 'channel' | 'role' | 'user' | 'mention' | 'punishment',
  value: string,
) => {
  switch (type) {
    case 'channel': {
      return `<#${value}>`;
    }
    case 'role': {
      return `<@&${value}>`;
    }
    case 'user': {
      return `<@${value}>`;
    }
    case 'punishment': {
      return language.punishments[value as keyof typeof language.punishments];
    }
    default: {
      return value;
    }
  }
};

const getGlobalDesc = (type: BLWLType, language: CT.Language) => {
  switch (type) {
    case 'blchannelid': {
      return language.slashCommands.settings.blchannel;
    }
    case 'blroleid': {
      return language.slashCommands.settings.blrole;
    }
    case 'bluserid': {
      return language.slashCommands.settings.bluser;
    }
    case 'wlchannelid': {
      return language.slashCommands.settings.wlchannel;
    }
    case 'wlroleid': {
      return language.slashCommands.settings.wlrole;
    }
    case 'wluserid': {
      return language.slashCommands.settings.wluser;
    }
    default: {
      return language.unknown;
    }
  }
};
