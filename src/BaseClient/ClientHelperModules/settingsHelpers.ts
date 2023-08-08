import * as Discord from 'discord.js';
import { glob } from 'glob';
import ms from 'ms';
import { Prisma } from '@prisma/client';
import * as CT from '../../Typings/CustomTypings.js';
import stringEmotes from './stringEmotes.js';
import objectEmotes from './objectEmotes.js';
import moment from './moment.js';
import constants from '../Other/constants.js';
import client from '../Client.js';
import error from './error.js';
import DataBase from '../DataBase.js';
import getLogChannels from './getLogChannels.js';
import send from './send.js';
import { makeCodeBlock, makeInlineCode } from './util.js';

type MentionTypes =
 | 'rolemode'
 | 'channel'
 | 'role'
 | 'user'
 | 'mention'
 | 'punishment'
 | 'language'
 | 'settinglink'
 | 'embed'
 | 'emote'
 | 'commands'
 | 'automodrules';

// eslint-disable-next-line no-console
const { log } = console;

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
 roles: (val: string[] | null, language: CT.Language) =>
  val?.length ? val.map((c) => `<@&${c}>`).join(', ') : language.None,
 users: (val: string[] | null, language: CT.Language) =>
  val?.length ? val.map((c) => `<@${c}>`).join(', ') : language.None,
 channel: (val: string | null, language: CT.Language) =>
  val?.length ? `<#${val}>` : language.None,
 role: (val: string | null, language: CT.Language) => (val?.length ? `<@&${val}>` : language.None),
 rules: (val: string[] | null, language: CT.Language, guild: Discord.Guild) =>
  val && val.length
   ? val.map((v) => `\`${guild.autoModerationRules.cache.get(v)?.name ?? v}\``).join(', ')
   : language.None,
 user: (val: string | null, language: CT.Language) => (val?.length ? `<@${val}>` : language.None),
 number: (val: string | number | Prisma.Decimal | null, language: CT.Language) =>
  val ? String(val) : language.None,
 time: (val: number | null, language: CT.Language) => (val ? moment(val, language) : language.None),
 string: (val: string, language: CT.Language) => val ?? language.None,
 embed: async (val: Prisma.Decimal | null, language: CT.Language) =>
  val
   ? (await DataBase.customembeds.findUnique({ where: { uniquetimestamp: val } }))?.name ??
     language.None
   : language.None,
 emote: (val: string | null, language: CT.Language) =>
  val
   ? `${!Discord.parseEmoji(val)?.id ? val : `<${val.startsWith('a:') ? '' : ':'}${val}>`}`
   : language.None,
 command: (val: string | null, language: CT.Language) => {
  if (!val) return language.None;

  const isID = val?.replace(/\D+/g, '').length === val?.length;
  const cmd = isID ? client.application?.commands.cache.get(val) : undefined;
  if (cmd) return `</${cmd.name}:${cmd.id}>`;
  return `\`${val}\``;
 },
};

const back = <T extends keyof SettingsNames>(
 name: T,
 uniquetimestamp: number | undefined | string,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Danger,
 custom_id: `settings/settingsDisplay_${name}_${uniquetimestamp}`,
 emoji: objectEmotes.back,
});

const buttonParsers = {
 global: (
  language: CT.Language,
  setting: boolean | string[] | null,
  type: BLWLType | 'active',
  settingName: string,
  uniquetimestamp: number | undefined,
 ): Discord.APIButtonComponent => ({
  type: Discord.ComponentType.Button,
  label: getLabel(language, type),
  style: getStyle(setting),
  custom_id: `settings/editors/${getGlobalType(type)}_${type}_${settingName}_${uniquetimestamp}`,
  emoji: getEmoji(setting, type),
 }),
 specific: <T extends keyof SettingsNames>(
  language: CT.Language,
  setting: string[] | string | boolean | null | Prisma.Decimal,
  name: keyof FieldName<T>,
  settingName: T,
  uniquetimestamp: number | undefined,
  type?: 'channel' | 'role' | 'user',
  emoji?: Discord.APIMessageComponentEmoji,
 ): Discord.APIButtonComponent => {
  const constantTypes =
   constants.commands.settings.types[settingName as keyof typeof constants.commands.settings.types];

  if (!constantTypes) {
   throw new Error(`Constants for ${settingName} missing at constants.commands.settings.types[]`);
  }

  return {
   type: Discord.ComponentType.Button,
   label: (
    (
     language.slashCommands.settings.categories[
      settingName as keyof CT.Language['slashCommands']['settings']['categories']
     ].fields as FieldName<T>
    )[name] as unknown as Record<string, string>
   ).name,
   style:
    (typeof setting !== 'boolean' && setting && String(setting).length) || !!setting
     ? Discord.ButtonStyle.Primary
     : Discord.ButtonStyle.Secondary,
   custom_id: `settings/editors/${constantTypes[name as keyof typeof constantTypes]}_${String(
    name,
   )}_${settingName}_${uniquetimestamp}`,
   emoji: (type ? getEmoji(setting, `wl${type}id`) : undefined) ?? emoji,
  };
 },
 setting: <T extends keyof SettingsNames>(
  language: CT.Language,
  setting: string[] | string | boolean | null,
  name: keyof FieldName<T>,
  settingName: T,
  linkName: keyof SettingsNames,
  uniquetimestamp: number | undefined,
 ): Discord.APIButtonComponent => ({
  type: Discord.ComponentType.Button,
  label: (
   (
    language.slashCommands.settings.categories[
     settingName as keyof CT.Language['slashCommands']['settings']['categories']
    ].fields as FieldName<T>
   )[name] as unknown as Record<string, string>
  ).name,
  style: setting ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Secondary,
  custom_id: `settings/editors/settinglink_${String(
   name,
  )}_${settingName}_${linkName}_${uniquetimestamp}`,
  emoji: objectEmotes.settings,
 }),
 boolean: <T extends keyof SettingsNames>(
  language: CT.Language,
  setting: boolean | undefined,
  name: keyof FieldName<T>,
  settingName: T,
  uniquetimestamp: number | undefined,
 ): Discord.APIButtonComponent => {
  const constantTypes =
   constants.commands.settings.types[settingName as keyof typeof constants.commands.settings.types];

  return {
   type: Discord.ComponentType.Button,
   label: (
    (
     language.slashCommands.settings.categories[
      settingName as keyof CT.Language['slashCommands']['settings']['categories']
     ].fields as FieldName<T>
    )[name] as unknown as Record<'name', string>
   ).name,
   style: setting ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Secondary,
   custom_id: `settings/editors/${constantTypes[name as keyof typeof constantTypes]}_${String(
    name,
   )}_${settingName}_${uniquetimestamp}`,
   emoji: setting ? objectEmotes.enabled : objectEmotes.disabled,
  };
 },
 create: <T extends keyof SettingsNames>(
  language: CT.Language,
  name: T,
 ): Discord.APIButtonComponentWithCustomId => ({
  type: Discord.ComponentType.Button,
  label: language.slashCommands.settings.create,
  style: Discord.ButtonStyle.Success,
  custom_id: `settings/create_${name}`,
  emoji: objectEmotes.plusBG,
 }),
 delete: <T extends keyof SettingsNames>(
  language: CT.Language,
  name: T,
  uniquetimestamp: number | undefined,
 ): Discord.APIButtonComponent => ({
  type: Discord.ComponentType.Button,
  label: language.slashCommands.settings.delete,
  style: Discord.ButtonStyle.Danger,
  custom_id: `settings/delete_${name}_${uniquetimestamp}`,
  emoji: objectEmotes.minusBG,
 }),
 previous: <T extends keyof SettingsNames>(
  language: CT.Language,
  name: T,
  enabled = false,
 ): Discord.APIButtonComponent => ({
  type: Discord.ComponentType.Button,
  label: language.slashCommands.settings.previous,
  style: Discord.ButtonStyle.Success,
  custom_id: `settings/previous_${name}`,
  emoji: objectEmotes.back,
  disabled: !enabled,
 }),
 next: <T extends keyof SettingsNames>(
  language: CT.Language,
  name: T,
  uniquetimestamp: number | undefined,
  enabled = false,
 ): Discord.APIButtonComponent => ({
  type: Discord.ComponentType.Button,
  label: language.slashCommands.settings.next,
  style: Discord.ButtonStyle.Success,
  custom_id: `settings/next_${name}_${uniquetimestamp}`,
  emoji: objectEmotes.forth,
  disabled: !enabled,
 }),
 back,
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
 options: <T extends keyof SettingsNames>(
  language: CT.Language,
  name: T,
 ): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => [
  {
   type: Discord.ComponentType.ActionRow,
   components: [buttonParsers.create(language, name)],
  },
 ],
 components: <T extends keyof SettingsNames>(
  embeds: Discord.APIEmbed[],
  components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[],
  language: CT.Language,
  name: T,
 ) => {
  if (Number(embeds[0].fields?.length) > 25) {
   components.unshift({
    type: Discord.ComponentType.ActionRow,
    components: [
     buttonParsers.previous(language, name),
     buttonParsers.next(language, name, undefined, true),
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

const postUpdate = async <T extends keyof SettingsNames>(
 oldSetting: unknown,
 newSetting: unknown,
 changedSetting: keyof FieldName<T>,
 settingName: T,
 uniquetimestamp: number | string | undefined,
) => {
 const files = await glob(`${process.cwd()}/Commands/SlashCommands/**/*`);

 const file = files.find((f) =>
  f.endsWith(
   `/${
    constants.commands.settings.basicSettings.includes(settingName)
     ? `${settingName}/basic`
     : settingName
   }.js`,
  ),
 );
 if (!file) return;

 const tableName = constants.commands.settings.tableNames[
  settingName as keyof typeof constants.commands.settings.tableNames
 ] as keyof CT.Language['slashCommands']['settings']['categories'];

 const settingsFile = (await import(file)) as CT.SettingsFile<typeof tableName>;

 settingsFile.postChange?.(
  oldSetting as CT.TableNamesMap[T],
  newSetting as CT.TableNamesMap[T],
  changedSetting as never,
  uniquetimestamp,
 );
};

const changeHelpers = {
 get: async (
  tableName: keyof CT.TableNamesMap,
  guildid: string,
  uniquetimestamp: number | undefined,
 ) => {
  const getDBType = () => {
   if (uniquetimestamp) {
    const where = { where: { uniquetimestamp } };

    switch (tableName) {
     // case 'appeal-questions':
     //  return DataBase.appealquestions.findUnique(where);
     case 'vote-rewards':
      return DataBase.voterewards.findUnique(where);
     case 'auto-punish':
      return DataBase.autopunish.findUnique(where);
     case 'role-rewards':
      return DataBase.rolerewards.findUnique(where);
     case 'cooldowns':
      return DataBase.cooldowns.findUnique(where);
     case 'self-roles':
      return DataBase.selfroles.findUnique(where);
     case 'separators':
      return DataBase.roleseparator.findUnique(where);
     case 'vote':
      return DataBase.votesettings.findUnique(where);
     case 'multi-channels':
      return DataBase.levelingmultichannels.findUnique(where);
     case 'multi-roles':
      return DataBase.levelingmultiroles.findUnique(where);
     case 'level-roles':
      return DataBase.levelingroles.findUnique(where);
     case 'rule-channels':
      return DataBase.levelingruleschannels.findUnique(where);
     case 'button-role-settings':
      return DataBase.buttonrolesettings.findUnique(where);
     case 'reaction-role-settings':
      return DataBase.reactionrolesettings.findUnique(where);
     case 'reaction-roles':
      return DataBase.reactionroles.findUnique(where);
     case 'button-roles':
      return DataBase.buttonroles.findUnique(where);
     case 'booster-roles':
      return DataBase.nitroroles.findUnique(where);
     default:
      throw new Error(`Unsupported Setting ${tableName}`);
    }
   } else {
    const where = { where: { guildid } };

    switch (tableName) {
     case 'basic':
      return DataBase.guildsettings.findUnique(where);
     case 'anti-spam':
      return DataBase.antispam.findUnique(where);
     case 'anti-virus':
      return DataBase.antivirus.findUnique(where);
     case 'anti-raid':
      return DataBase.antiraid.findUnique(where);
     case 'blacklist':
      return DataBase.blacklist.findUnique(where);
     case 'expiry':
      return DataBase.expiry.findUnique(where);
     case 'auto-roles':
      return DataBase.autoroles.findUnique(where);
     case 'disboard-reminders':
      return DataBase.disboard.findUnique(where);
     case 'sticky':
      return DataBase.sticky.findUnique(where);
     case 'suggestions':
      return DataBase.suggestionsettings.findUnique(where);
     case 'logs':
      return DataBase.logchannels.findUnique(where);
     case 'verification':
      return DataBase.verification.findUnique(where);
     case 'leveling':
      return DataBase.leveling.findUnique(where);
     case 'welcome':
      return DataBase.welcome.findUnique(where);
     case 'nitro':
      return DataBase.nitrosettings.findUnique(where);
     // case 'appealsettings':
     //  DataBase.appealsettings.findUnique(where);

     default:
      throw new Error(`Unsupported Setting ${tableName}`);
    }
   }
  };

  return getDBType().then((r) => {
   if (!r) setup(tableName, guildid, uniquetimestamp);

   return r ?? null;
  });
 },
 getAndInsert: (
  tableName: keyof SettingsNames,
  fieldName: string,
  guildid: string,
  newSetting: unknown,
  uniquetimestamp: number | undefined,
 ) => {
  const getDBType = () => {
   if (uniquetimestamp) {
    const where = { where: { uniquetimestamp }, data: { [fieldName]: newSetting } };

    switch (tableName) {
     // case 'appeal-questions':
     //  return DataBase.appealquestions.update(where);
     case 'vote-rewards':
      return DataBase.voterewards.update(where);
     case 'auto-punish':
      return DataBase.autopunish.update(where);
     case 'role-rewards':
      return DataBase.rolerewards.update(where);
     case 'cooldowns':
      return DataBase.cooldowns.update(where);
     case 'self-roles':
      return DataBase.selfroles.update(where);
     case 'separators':
      return DataBase.roleseparator.update(where);
     case 'vote':
      return DataBase.votesettings.update(where);
     case 'multi-channels':
      return DataBase.levelingmultichannels.update(where);
     case 'multi-roles':
      return DataBase.levelingmultiroles.update(where);
     case 'level-roles':
      return DataBase.levelingroles.update(where);
     case 'rule-channels':
      return DataBase.levelingruleschannels.update(where);
     case 'button-role-settings':
      return DataBase.buttonrolesettings.update(where);
     case 'reaction-role-settings':
      return DataBase.reactionrolesettings.update(where);
     case 'reaction-roles':
      return DataBase.reactionroles.update(where);
     case 'button-roles':
      return DataBase.buttonroles.update(where);
     case 'booster-roles':
      return DataBase.nitroroles.update(where);
     default:
      throw new Error(`Unsupported Setting ${tableName}`);
    }
   } else {
    const where = { where: { guildid }, data: { [fieldName]: newSetting } };

    switch (tableName) {
     case 'basic':
      return DataBase.guildsettings.update(where);
     case 'anti-spam':
      return DataBase.antispam.update(where);
     case 'anti-virus':
      return DataBase.antivirus.update(where);
     case 'anti-raid':
      return DataBase.antiraid.update(where);
     case 'blacklist':
      return DataBase.blacklist.update(where);
     case 'expiry':
      return DataBase.expiry.update(where);
     case 'auto-roles':
      return DataBase.autoroles.update(where);
     case 'disboard-reminders':
      return DataBase.disboard.update(where);
     case 'sticky':
      return DataBase.sticky.update(where);
     case 'suggestions':
      return DataBase.suggestionsettings.update(where);
     case 'logs':
      return DataBase.logchannels.update(where);
     case 'verification':
      return DataBase.verification.update(where);
     case 'leveling':
      return DataBase.leveling.update(where);
     case 'welcome':
      return DataBase.welcome.update(where);
     case 'nitro':
      return DataBase.nitrosettings.update(where);
     // case 'appealsettings':
     //  DataBase.appealsettings.update(where);

     default:
      throw new Error(`Unsupported Setting ${tableName}`);
    }
   }
  };

  return getDBType();
 },
 changeEmbed: async <T extends keyof SettingsNames>(
  language: CT.Language,
  settingName: T,
  fieldName: string,
  values: string[] | string | undefined,
  type: MentionTypes,
  guild: Discord.Guild,
 ): Promise<Discord.APIEmbed> => ({
  author: {
   name: language.slashCommands.settings.authorType(
    language.slashCommands.settings.categories[settingName].name,
   ),
   icon_url: objectEmotes.settings.link,
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
      language.slashCommands.settings.categories[settingName].fields[fieldName as never] as Record<
       string,
       string
      >
     )?.desc ?? getGlobalDesc(fieldName as BLWLType, language),
   },
  ],
  color: constants.colors.ephemeral,
 }),
 changeSelectGlobal: <T extends keyof SettingsNames>(
  language: CT.Language,
  type: 'channel' | 'role' | 'user' | 'mention' | 'channels' | 'roles' | 'users' | 'mentions',
  fieldName: string,
  settingName: T,
  uniquetimestamp: number | undefined | string,
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
   disabled?: boolean;
  },
  uniquetimestamp: number | undefined,
 ) => {
  const menu: Discord.APIStringSelectComponent = {
   min_values: options.min_values || 1,
   max_values: options.max_values || 1,
   custom_id: `settings/${type}_${fieldName}_${settingName}${
    uniquetimestamp ? `_${uniquetimestamp}` : ''
   }`,
   type: Discord.ComponentType.StringSelect,
   options: (options.options.length ? options.options : [{ label: '-', value: '-' }]) ?? [
    { label: '-', value: '-' },
   ],
   placeholder: options.placeholder,
   disabled: options.disabled || !options.options.length,
  };

  return menu;
 },
 changeModal: <T extends keyof SettingsNames>(
  language: CT.Language,
  settingName: T,
  fieldName: string,
  type:
   | 'number'
   | 'duration'
   | 'string'
   | 'strings'
   | 'autoModRule/string'
   | 'autoModRule/strings'
   | 'autoModRule/duration',
  current: string | undefined,
  short: boolean,
  uniquetimestamp: number | string | undefined,
  required = true,
 ): Discord.APIModalInteractionResponseCallbackData => ({
  title: (
   language.slashCommands.settings.categories[settingName].fields[fieldName as never] as Record<
    string,
    string
   >
  ).name,
  custom_id: `settings/${type}_${settingName}${uniquetimestamp ? `_${uniquetimestamp}` : ''}`,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: short ? Discord.TextInputStyle.Short : Discord.TextInputStyle.Paragraph,
      label: language.slashCommands.settings.insertHere,
      value:
       (type === 'duration' && current ? String(ms(Number(current) * 1000)) : current) ?? undefined,
      custom_id: fieldName,
      required,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Paragraph,
      label: language.slashCommands.settings.acceptedValue,
      custom_id: '-',
      value: (
       language.slashCommands.settings.categories[settingName].fields[fieldName as never] as Record<
        string,
        string
       >
      ).desc,
      max_length: (
       language.slashCommands.settings.categories[settingName].fields[fieldName as never] as Record<
        string,
        string
       >
      ).desc.length,
      min_length: (
       language.slashCommands.settings.categories[settingName].fields[fieldName as never] as Record<
        string,
        string
       >
      ).desc.length,
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
 back,
 done: <T extends keyof SettingsNames>(
  name: T,
  fieldName: string,
  type: 'channel' | 'channels' | 'role' | 'roles' | 'user' | 'users' | string,
  language: CT.Language,
  uniquetimestamp: number | undefined | string,
 ): Discord.APIButtonComponent => ({
  type: Discord.ComponentType.Button,
  style: Discord.ButtonStyle.Success,
  custom_id: `settings/done/${type}_${name}_${fieldName}_${uniquetimestamp}`,
  label: language.Done,
 }),
 makeEmpty: <T extends keyof SettingsNames>(
  name: T,
  fieldName: string,
  type: 'array' | 'autoModRule/array',
  language: CT.Language,
  uniquetimestamp: number | undefined | string,
 ): Discord.APIButtonComponent => ({
  type: Discord.ComponentType.Button,
  style: Discord.ButtonStyle.Secondary,
  custom_id: `settings/empty/${type}_${name}_${fieldName}_${uniquetimestamp}`,
  label: language.Empty,
 }),
};

export const getEmoji = (
 setting: string | boolean | string[] | undefined | Prisma.Decimal | null,
 type?: BLWLType | 'active',
) => {
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

export const getStyle = (setting: boolean | string | string[] | null) => {
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

const getMention = async (
 language: CT.Language,
 type: MentionTypes,
 value: string,
 guild: Discord.Guild,
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
  case 'language': {
   return language.languages[value as keyof typeof language.languages];
  }
  case 'rolemode': {
   return language.rolemodes[value as keyof typeof language.rolemodes];
  }
  case 'embed': {
   return DataBase.customembeds
    .findUnique({ where: { uniquetimestamp: value } })
    .then((r) => r?.name ?? '?');
  }
  case 'emote': {
   return `<${`${value.startsWith(':') ? '' : ':'}${value}`}>`;
  }
  case 'commands': {
   const cmd = client.application?.commands.cache.get(value);

   if (!cmd) return `\`${value}\``;
   return `</${cmd?.name}:${cmd?.id}>`;
  }
  case 'automodrules': {
   const rule = (guild as NonNullable<typeof guild>).autoModerationRules.cache.get(value);

   return makeInlineCode(rule?.name ?? value);
  }
  default: {
   return value;
  }
 }
};

const getGlobalDesc = (
 type: BLWLType | 'autoModRule/channel' | 'autoModRule/channels' | 'autoModRule/roles',
 language: CT.Language,
) => {
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
  case 'autoModRule/channel': {
   return language.events.logs.automodRule.alertChannel;
  }
  case 'autoModRule/roles': {
   return language.events.logs.automodRule.exemptRoles;
  }
  case 'autoModRule/channels': {
   return language.events.logs.automodRule.exemptChannels;
  }
  default: {
   log(new Error(`Unknown Type ${type}`));
   return language.unknown;
  }
 }
};

const getSettingsFile = async <
 T extends keyof CT.Language['slashCommands']['settings']['categories'],
>(
 settingName: T,
 guild: Discord.Guild,
) => {
 const files = await glob(`${process.cwd()}/Commands/SlashCommands/settings/**/*`);

 const file = files.find((f) =>
  f.endsWith(
   `/${
    constants.commands.settings.basicSettings.includes(settingName)
     ? `${settingName}/basic`
     : settingName
   }.js`,
  ),
 );
 if (!file) {
  error(guild, new Error('No file found for settings'));
  return undefined;
 }

 return (await import(file)) as CT.SettingsFile<typeof settingName>;
};

const setup = (tableName: keyof CT.TableNamesMap, guildid: string, uniquetimestamp?: number) => {
 const getDBType = () => {
  if (uniquetimestamp) {
   const where = { data: { uniquetimestamp, guildid } };

   switch (tableName) {
    // case 'appeal-questions':
    //  return DataBase.appealquestions.create(where);
    case 'vote-rewards':
     return DataBase.voterewards.create(where);
    case 'auto-punish':
     return DataBase.autopunish.create(where);
    case 'role-rewards':
     return DataBase.rolerewards.create(where);
    case 'cooldowns':
     return DataBase.cooldowns.create(where);
    case 'self-roles':
     return DataBase.selfroles.create(where);
    case 'separators':
     return DataBase.roleseparator.create(where);
    case 'vote':
     return DataBase.votesettings.create(where);
    case 'multi-channels':
     return DataBase.levelingmultichannels.create(where);
    case 'multi-roles':
     return DataBase.levelingmultiroles.create(where);
    case 'level-roles':
     return DataBase.levelingroles.create(where);
    case 'rule-channels':
     return DataBase.levelingruleschannels.create(where);
    case 'button-role-settings':
     return DataBase.buttonrolesettings.create(where);
    case 'reaction-role-settings':
     return DataBase.reactionrolesettings.create(where);
    case 'reaction-roles':
     return DataBase.reactionroles.create(where);
    case 'button-roles':
     return DataBase.buttonroles.create(where);
    case 'booster-roles':
     return DataBase.nitroroles.create(where);
    default:
     throw new Error(`Unsupported Setting ${tableName}`);
   }
  } else {
   const where = { data: { guildid } };

   switch (tableName) {
    case 'basic':
     return DataBase.guildsettings.create(where);
    case 'anti-spam':
     return DataBase.antispam.create(where);
    case 'anti-virus':
     return DataBase.antivirus.create(where);
    case 'anti-raid':
     return DataBase.antiraid.create(where);
    case 'blacklist':
     return DataBase.blacklist.create(where);
    case 'expiry':
     return DataBase.expiry.create(where);
    case 'auto-roles':
     return DataBase.autoroles.create(where);
    case 'disboard-reminders':
     return DataBase.disboard.create(where);
    case 'sticky':
     return DataBase.sticky.create(where);
    case 'suggestions':
     return DataBase.suggestionsettings.create(where);
    case 'logs':
     return DataBase.logchannels.create(where);
    case 'verification':
     return DataBase.verification.create(where);
    case 'leveling':
     return DataBase.leveling.create(where);
    case 'welcome':
     return DataBase.welcome.create(where);
    case 'nitro':
     return DataBase.nitrosettings.create(where);
    // case 'appealsettings':
    //  DataBase.appealsettings.create(where);

    default:
     throw new Error(`Unsupported Setting ${tableName}`);
   }
  }
 };

 return getDBType();
};

const del = (tableName: keyof CT.TableNamesMap, guildid: string, uniquetimestamp: number) => {
 const getDBType = () => {
  const where = { where: { uniquetimestamp, guildid } };

  switch (tableName) {
   // case 'appeal-questions':
   //  return DataBase.appealquestions.delete(where);
   case 'vote-rewards':
    return DataBase.voterewards.delete(where);
   case 'auto-punish':
    return DataBase.autopunish.delete(where);
   case 'role-rewards':
    return DataBase.rolerewards.delete(where);
   case 'cooldowns':
    return DataBase.cooldowns.delete(where);
   case 'self-roles':
    return DataBase.selfroles.delete(where);
   case 'separators':
    return DataBase.roleseparator.delete(where);
   case 'vote':
    return DataBase.votesettings.delete(where);
   case 'multi-channels':
    return DataBase.levelingmultichannels.delete(where);
   case 'multi-roles':
    return DataBase.levelingmultiroles.delete(where);
   case 'level-roles':
    return DataBase.levelingroles.delete(where);
   case 'rule-channels':
    return DataBase.levelingruleschannels.delete(where);
   case 'button-role-settings':
    return DataBase.buttonrolesettings.delete(where);
   case 'reaction-role-settings':
    return DataBase.reactionrolesettings.delete(where);
   case 'reaction-roles':
    return DataBase.reactionroles.delete(where);
   case 'button-roles':
    return DataBase.buttonroles.delete(where);
   case 'booster-roles':
    return DataBase.nitroroles.delete(where);
   default:
    throw new Error(`Unsupported Setting ${tableName}`);
  }
 };

 return getDBType();
};

export const updateLog = async <T extends keyof SettingsNames>(
 oldSetting: { [key in keyof FieldName<T>]: unknown } | undefined,
 newSetting: { [key in keyof FieldName<T>]: unknown } | undefined,
 changedSetting: keyof FieldName<T>,
 settingName: T,
 uniquetimestamp: number | string | undefined,
 guild: Discord.Guild,
 language: CT.Language,
 lan: SettingsNames[T],
) => {
 postUpdate(oldSetting, newSetting, changedSetting, settingName, uniquetimestamp);

 const logs = await getLogChannels('settingslog', guild);
 if (!logs) return;

 const getColor = () => {
  switch (true) {
   case !oldSetting: {
    return constants.colors.success;
   }
   case !newSetting: {
    return constants.colors.danger;
   }
   default: {
    return constants.colors.loading;
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
      value: language.slashCommands.settings.log.created(settingName),
     },
    ];
   }
   case !newSetting: {
    return [
     {
      name: language.slashCommands.settings.delete,
      value: language.slashCommands.settings.log.deleted(settingName),
     },
    ];
   }
   default: {
    return [
     {
      name: language.Before,
      value: `${makeInlineCode(field.name)}:\n${makeCodeBlock(
       oldSetting?.[changedSetting] as string,
      )}`,
      inline: false,
     },
     {
      name: language.After,
      value: `${makeInlineCode(field.name)}:\n${makeCodeBlock(
       newSetting?.[changedSetting] as string,
      )}`,
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

 send({ id: logs, guildId: guild.id }, { embeds: [embed] });
};

export default {
 embedParsers,
 buttonParsers,
 multiRowHelpers,
 updateLog,
 changeHelpers,
 getSettingsFile,
 setup,
 del,
};
