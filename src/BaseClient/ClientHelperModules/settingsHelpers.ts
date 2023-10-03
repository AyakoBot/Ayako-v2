import * as Discord from 'discord.js';
import { glob } from 'glob';
import ms from 'ms';
import { Prisma } from '@prisma/client';
import * as CT from '../../Typings/CustomTypings.js';
import emotes from './emotes.js';
import moment from './moment.js';
import constants, { TableNamesPrismaTranslation } from '../Other/constants.js';
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

/**
 * Object containing various parsers for different types of settings.
 */
const embedParsers = {
 /**
  * Parser for author type settings.
  * @param language - The language object containing translations.
  * @param lan - The name of the author type.
  * @returns An object containing the author's icon URL, name, and URL.
  */
 author: <T extends keyof SettingsNames>(language: CT.Language, lan: SettingsNames[T]) => ({
  icon_url: emotes.settings.link,
  name: language.slashCommands.settings.authorType(lan.name),
  url: constants.standard.invite,
 }),

 /**
  * Parser for boolean type settings.
  * @param val - The boolean value to parse.
  * @param language - The language object containing translations.
  * @returns A string representation of the boolean value.
  */
 boolean: (val: boolean | undefined, language: CT.Language) =>
  val
   ? `${constants.standard.getEmote(emotes.enabled)} ${language.Enabled}`
   : `${constants.standard.getEmote(emotes.disabled)} ${language.Disabled}`,

 /**
  * Parser for channels type settings.
  * @param val - The array of channel IDs to parse.
  * @param language - The language object containing translations.
  * @returns A string representation of the channels.
  */
 channels: (val: string[] | undefined, language: CT.Language) =>
  val?.length ? val.map((c) => `<#${c}>`).join(', ') : language.None,

 /**
  * Parser for roles type settings.
  * @param val - The array of role IDs to parse.
  * @param language - The language object containing translations.
  * @returns A string representation of the roles.
  */
 roles: (val: string[] | null, language: CT.Language) =>
  val?.length ? val.map((c) => `<@&${c}>`).join(', ') : language.None,

 /**
  * Parser for users type settings.
  * @param val - The array of user IDs to parse.
  * @param language - The language object containing translations.
  * @returns A string representation of the users.
  */
 users: (val: string[] | null, language: CT.Language) =>
  val?.length ? val.map((c) => `<@${c}>`).join(', ') : language.None,

 /**
  * Parser for channel type settings.
  * @param val - The channel ID to parse.
  * @param language - The language object containing translations.
  * @returns A string representation of the channel.
  */
 channel: (val: string | null, language: CT.Language) =>
  val?.length ? `<#${val}>` : language.None,

 /**
  * Parser for role type settings.
  * @param val - The role ID to parse.
  * @param language - The language object containing translations.
  * @returns A string representation of the role.
  */
 role: (val: string | null, language: CT.Language) => (val?.length ? `<@&${val}>` : language.None),

 /**
  * Parser for rules type settings.
  * @param val - The array of rule IDs to parse.
  * @param language - The language object containing translations.
  * @param guild - The Discord guild object.
  * @returns A string representation of the rules.
  */
 rules: (val: string[] | null, language: CT.Language, guild: Discord.Guild) =>
  val && val.length
   ? val.map((v) => `\`${guild.autoModerationRules.cache.get(v)?.name ?? v}\``).join(', ')
   : language.None,

 /**
  * Parser for user type settings.
  * @param val - The user ID to parse.
  * @param language - The language object containing translations.
  * @returns A string representation of the user.
  */
 user: (val: string | null, language: CT.Language) => (val?.length ? `<@${val}>` : language.None),

 /**
  * Parser for number type settings.
  * @param val - The number value to parse.
  * @param language - The language object containing translations.
  * @returns A string representation of the number value.
  */
 number: (val: string | number | Prisma.Decimal | null, language: CT.Language) =>
  val ? String(val) : language.None,

 /**
  * Parser for time type settings.
  * @param val - The timestamp value to parse.
  * @param language - The language object containing translations.
  * @returns A moment.js object representing the timestamp value.
  */
 time: (val: number | null, language: CT.Language) => (val ? moment(val, language) : language.None),

 /**
  * Parser for string type settings.
  * @param val - The string value to parse.
  * @param language - The language object containing translations.
  * @returns The string value or the "None" string if the value is falsy.
  */
 string: (val: string, language: CT.Language) => val ?? language.None,

 /**
  * Parser for embed type settings.
  * @param val - The unique timestamp of the custom embed to parse.
  * @param language - The language object containing translations.
  * @returns The name of the custom embed or the "None" string if the value is falsy.
  */
 embed: async (val: Prisma.Decimal | null, language: CT.Language) =>
  val
   ? (await DataBase.customembeds.findUnique({ where: { uniquetimestamp: val } }))?.name ??
     language.None
   : language.None,

 /**
  * Parser for emote type settings.
  * @param val - The emote string to parse.
  * @param language - The language object containing translations.
  * @returns The emote string or the "None" string if the value is falsy.
  */
 emote: (val: string | null, language: CT.Language) =>
  val
   ? `${!Discord.parseEmoji(val)?.id ? val : `<${val.startsWith('a:') ? '' : ':'}${val}>`}`
   : language.None,

 /**
  * Parser for command type settings.
  * @param val - The command ID or name to parse.
  * @param language - The language object containing translations.
  * @returns A string representation of the command.
  */
 command: (val: string | null, language: CT.Language) => {
  if (!val) return language.None;

  const isID = val?.replace(/\D+/g, '').length === val?.length;
  const cmd = isID ? client.application?.commands.cache.get(val) : undefined;
  if (cmd) return `</${cmd.name}:${cmd.id}>`;
  return `\`${val}\``;
 },
};

/**
 * Returns a Discord API button component with the specified name and unique timestamp.
 * @template T - The type of the settings name.
 * @param {T} name - The name of the settings.
 * @param {number | undefined | string} uniquetimestamp - The unique timestamp of the settings.
 * @returns {Discord.APIButtonComponent} - The Discord API button component.
 */
const back = <T extends keyof SettingsNames>(
 name: T,
 uniquetimestamp: number | undefined | string,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Danger,
 custom_id: `settings/settingsDisplay_${name}_${uniquetimestamp}`,
 emoji: emotes.back,
});

/**
 * This module contains helper functions for creating Discord API button components
 * used in the settings editor.
 * @packageDocumentation
 */

/**
 * An object containing functions for creating Discord API button components
 * used in the settings editor.
 */
const buttonParsers = {
 /**
  * Creates a global button component for the settings editor.
  * @param language - The language object containing translations.
  * @param setting - The current value of the setting.
  * @param type - The type of setting.
  * @param settingName - The name of the setting.
  * @param uniquetimestamp - A unique timestamp used to identify the button component.
  * @returns A Discord API button component.
  */
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

 /**
  * Creates a specific button component for the settings editor.
  * @param language - The language object containing translations.
  * @param setting - The current value of the setting.
  * @param name - The name of the field.
  * @param settingName - The name of the setting.
  * @param uniquetimestamp - A unique timestamp used to identify the button component.
  * @param type - The type of setting.
  * @param emoji - The emoji to use for the button component.
  * @returns A Discord API button component.
  */
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

 /**
  * Creates a setting button component for the settings editor.
  * @param language - The language object containing translations.
  * @param setting - The current value of the setting.
  * @param name - The name of the field.
  * @param settingName - The name of the setting.
  * @param linkName - The name of the linked setting.
  * @param uniquetimestamp - A unique timestamp used to identify the button component.
  * @returns A Discord API button component.
  */
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
  emoji: emotes.settings,
 }),

 /**
  * Creates a boolean button component for the settings editor.
  * @param language - The language object containing translations.
  * @param setting - The current value of the setting.
  * @param name - The name of the field.
  * @param settingName - The name of the setting.
  * @param uniquetimestamp - A unique timestamp used to identify the button component.
  * @returns A Discord API button component.
  */
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
   emoji: setting ? emotes.enabled : emotes.disabled,
  };
 },

 /**
  * Creates a button component for creating a new setting.
  * @param language - The language object containing translations.
  * @param name - The name of the setting.
  * @returns A Discord API button component with a custom ID.
  */
 create: <T extends keyof SettingsNames>(
  language: CT.Language,
  name: T,
 ): Discord.APIButtonComponentWithCustomId => ({
  type: Discord.ComponentType.Button,
  label: language.slashCommands.settings.create,
  style: Discord.ButtonStyle.Success,
  custom_id: `settings/create_${name}`,
  emoji: emotes.plusBG,
 }),

 /**
  * Creates a button component for deleting a setting.
  * @param language - The language object containing translations.
  * @param name - The name of the setting.
  * @param uniquetimestamp - A unique timestamp used to identify the button component.
  * @returns A Discord API button component.
  */
 delete: <T extends keyof SettingsNames>(
  language: CT.Language,
  name: T,
  uniquetimestamp: number | undefined,
 ): Discord.APIButtonComponent => ({
  type: Discord.ComponentType.Button,
  label: language.slashCommands.settings.delete,
  style: Discord.ButtonStyle.Danger,
  custom_id: `settings/delete_${name}_${uniquetimestamp}`,
  emoji: emotes.minusBG,
 }),

 /**
  * Creates a button component for navigating to the previous page of settings.
  * @param language - The language object containing translations.
  * @param name - The name of the setting.
  * @param enabled - Whether the button should be enabled or disabled.
  * @returns A Discord API button component.
  */
 previous: <T extends keyof SettingsNames>(
  language: CT.Language,
  name: T,
  enabled = false,
 ): Discord.APIButtonComponent => ({
  type: Discord.ComponentType.Button,
  label: language.slashCommands.settings.previous,
  style: Discord.ButtonStyle.Success,
  custom_id: `settings/previous_${name}`,
  emoji: emotes.back,
  disabled: !enabled,
 }),

 /**
  * Creates a button component for navigating to the next page of settings.
  * @param language - The language object containing translations.
  * @param name - The name of the setting.
  * @param uniquetimestamp - A unique timestamp used to identify the button component.
  * @param enabled - Whether the button should be enabled or disabled.
  * @returns A Discord API button component.
  */
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
  emoji: emotes.forth,
  disabled: !enabled,
 }),

 /**
  * A button component used for navigating back to the previous menu.
  */
 back,
};

/**
 * Helper functions for managing settings-related interactions in the Discord bot client.
 */
const multiRowHelpers = {
 /**
  * Adds a "no fields found" message to the first embed if it has no fields.
  * @param embeds - The array of embeds to check.
  * @param language - The language object containing the message to display.
  */
 noFields: (embeds: Discord.APIEmbed[], language: CT.Language) => {
  if (!embeds[0].fields?.length) {
   embeds[0].fields?.push({
    name: '\u200b',
    value: language.slashCommands.settings.noFields,
    inline: false,
   });
  }
 },
 /**
  * Generates an array of action row components for a given setting name.
  * @param language - The language object containing the button text.
  * @param name - The name of the setting to generate buttons for.
  * @returns An array of action row components containing a single button.
  */
 options: <T extends keyof SettingsNames>(
  language: CT.Language,
  name: T,
 ): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => [
  {
   type: Discord.ComponentType.ActionRow,
   components: [buttonParsers.create(language, name)],
  },
 ],
 /**
  * Adds pagination buttons to the beginning of the components array
  * if the number of fields exceeds 25.
  * @param embeds - The array of embeds to check.
  * @param components - The array of action row components to add the pagination buttons to.
  * @param language - The language object containing the button text.
  * @param name - The name of the setting being paginated.
  */
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
 /**
  * Generates an array of embeds for a given setting name.
  * @param fields - The array of fields to add to the embeds.
  * @param language - The language object containing the author text.
  * @param lan - The name of the setting being paginated.
  * @returns An array of APIEmbed objects.
  */
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

/**
 * Updates a setting and triggers a post-update action if necessary.
 * @param oldSetting The old value of the setting.
 * @param newSetting The new value of the setting.
 * @param changedSetting The field that was changed.
 * @param settingName The name of the setting.
 * @param guild The guild where the setting was changed.
 * @param uniquetimestamp A unique timestamp to identify the update.
 */
const postUpdate = async <T extends keyof SettingsNames>(
 oldSetting: unknown,
 newSetting: unknown,
 changedSetting: keyof FieldName<T>,
 settingName: T,
 guild: Discord.Guild,
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

 const tableName = TableNamesPrismaTranslation[
  settingName as keyof typeof TableNamesPrismaTranslation
 ] as keyof CT.Language['slashCommands']['settings']['categories'];

 const settingsFile = (await import(file)) as CT.SettingsFile<typeof tableName>;

 settingsFile.postChange?.(
  oldSetting as CT.TableNamesMap[T],
  newSetting as CT.TableNamesMap[T],
  changedSetting as never,
  guild,
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
      throw new Error(`1 Unsupported Setting ${tableName}`);
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
     case 'censor':
      return DataBase.censor.findUnique(where);
     case 'newlines':
      return DataBase.newlines.findUnique(where);
     case 'invites':
      return DataBase.invites.findUnique(where);
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
      throw new Error(`2 Unsupported Setting ${tableName}`);
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
      throw new Error(`3 Unsupported Setting ${tableName}`);
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
     case 'censor':
      return DataBase.censor.update(where);
     case 'newlines':
      return DataBase.newlines.update(where);
     case 'invites':
      return DataBase.invites.update(where);
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
      throw new Error(`4 Unsupported Setting ${tableName}`);
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
  required?: boolean,
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
      min_length: required ? 1 : 0,
      max_length: 4000,
      label: language.slashCommands.settings.insertHere,
      value:
       (type === 'duration' && current ? String(ms(Number(current) * 1000)) : current) ?? undefined,
      custom_id: fieldName,
      required: !!required,
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
  emoji: emotes.back,
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

/**
 * Returns the corresponding emoji based on the setting and type.
 * @param setting - The setting to determine the emoji for.
 * @param type - The type of setting to determine the emoji for.
 * @returns The corresponding emoji for the setting and type.
 */
export const getEmoji = (
 setting: string | boolean | string[] | undefined | Prisma.Decimal | null,
 type?: BLWLType | 'active',
) => {
 switch (type) {
  case 'blchannelid':
  case 'wlchannelid': {
   return emotes.channelTypes[0];
  }
  case 'blroleid':
  case 'wlroleid': {
   return emotes.Role;
  }
  case 'bluserid':
  case 'wluserid': {
   return emotes.Member;
  }
  default: {
   return setting ? emotes.enabled : emotes.disabled;
  }
 }
};

/**
 * Returns the label for a given type of blacklist/whitelist setting.
 * @param language - The language object containing the localized strings.
 * @param type - The type of blacklist/whitelist setting to get the label for.
 * @returns The label for the given type of blacklist/whitelist setting.
 */
const getLabel = (language: CT.Language, type: BLWLType | 'active') => {
 if (type && type !== 'active') {
  return language.slashCommands.settings[
   type.slice(0, -2) as 'blchannel' | 'blrole' | 'bluser' | 'wlchannel' | 'wlrole' | 'wluser'
  ];
 }
 return language.slashCommands.settings.active;
};

/**
 * Returns the appropriate Discord button style based on the provided setting.
 * @param setting - The setting to determine the button style for.
 * @returns The appropriate Discord button style.
 */
export const getStyle = (setting: boolean | string | string[] | null) => {
 if (typeof setting === 'boolean' || !setting) {
  return setting ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger;
 }
 return setting?.length ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Danger;
};

/**
 * Determines the global type based on the provided type.
 * @param type The type to determine the global type for.
 * @returns The global type as a string.
 */
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

/**
 * Returns the corresponding Discord ComponentType for the given select type.
 * @param type - The select type to get the ComponentType for.
 * @returns The corresponding Discord ComponentType for the given select type.
 */
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

/**
 * Returns a placeholder string based on the type of mentionable.
 * @param type - The type of mentionable.
 * @param language - The language object containing the placeholder strings.
 * @returns The placeholder string.
 */
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

/**
 * Returns a mention string based on the given type and value.
 * @param language - The language object containing language strings.
 * @param type - The type of mention to generate.
 * @param value - The value to use for the mention.
 * @param guild - The guild object to use for certain types of mentions.
 * @returns A mention string based on the given type and value.
 */
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

/**
 * Returns the description for a given type based on the provided language.
 * @param type - The type to get the description for.
 * @param language - The language object containing the descriptions.
 * @returns The description for the given type.
 */
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

/**
 * Retrieves the settings file for a given setting name and guild.
 * @param settingName - The name of the setting to retrieve.
 * @param guild - The guild to retrieve the setting for.
 * @returns The settings file for the given setting name, or undefined if no file is found.
 */
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

/**
 * Sets up a database query based on the provided table name,
 *  guild ID, and unique timestamp (optional).
 * @param tableName - The name of the table to query.
 * @param guildid - The ID of the guild to query.
 * @param uniquetimestamp - An optional unique timestamp to include in the query.
 * @returns A database query object based on the provided parameters.
 */
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
    case 'censor':
     return DataBase.censor.create(where);
    case 'newlines':
     return DataBase.newlines.create(where);
    case 'invites':
     return DataBase.invites.create(where);
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

/**
 * Deletes a row from the specified table in the database
 * based on the unique timestamp and guild ID.
 * @param tableName - The name of the table to delete the row from.
 * @param guildid - The ID of the guild where the row exists.
 * @param uniquetimestamp - The unique timestamp of the row to delete.
 * @returns A promise that resolves to the number of rows deleted from the table.
 * @throws An error if the specified table name is not supported.
 */
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
 postUpdate(oldSetting, newSetting, changedSetting, settingName, guild, uniquetimestamp);

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
       (oldSetting?.[changedSetting] as string) ?? ' ',
      )}`,
      inline: false,
     },
     {
      name: language.After,
      value: `${makeInlineCode(field.name)}:\n${makeCodeBlock(
       (newSetting?.[changedSetting] as string) ?? ' ',
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

/**
 * Helper functions for managing settings.
 * @property {Object} embedParsers
 * - Functions for parsing embed settings.
 * @property {Object} buttonParsers
 * - Functions for parsing button settings.
 * @property {Object} multiRowHelpers
 * - Functions for managing multi-row settings.
 * @property {Function} updateLog
 * - Function for updating the settings log.
 * @property {Object} changeHelpers
 * - Functions for managing changes to settings.
 * @property {Function} getSettingsFile
 * - Function for getting the settings file.
 * @property {Function} setup
 * - Function for setting up the settings file.
 * @property {Function} del
 * - Function for deleting a setting.
 */
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
