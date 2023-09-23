import * as Discord from 'discord.js';
import SlashCommands from '../../Events/readyEvents/startupTasks/SlashCommands.js';
import * as CT from '../../Typings/CustomTypings.js';
import * as util from './util.js';
import replyCmd from './replyCmd.js';
import getLanguage from './getLanguage.js';
import constants from '../Other/constants.js';
import emotes from './emotes.js';

type Command =
 | {
    parentCommand: string;
    subCommandGroup: string;
    subCommand: string;
   }
 | {
    parentCommand: string;
    subCommand: string;
    subCommandGroup?: undefined;
   }
 | {
    parentCommand: string;
    subCommandGroup?: undefined;
    subCommand?: undefined;
   };

/**
 * Returns the description of a command along with its options.
 * @param command - The command to get the description of.
 * @param rawCommand - An object containing the parent command and any subcommands
 * or subcommand groups.
 * @returns The description of the command and its options, if any.
 */
const getDesc = (
 command: Discord.ApplicationCommand,
 rawCommand: {
  parentCommand: string;
  subCommandGroup?: string;
  subCommand?: string;
 },
) => {
 let c: {
  options: Discord.ApplicationCommandOption[];
  description: string;
  name: string;
 } = command;

 if (rawCommand.subCommandGroup) {
  c = (c.options?.find((o) => o.name === rawCommand.subCommandGroup) as typeof c | undefined) ?? c;
 }

 if (rawCommand.subCommand) {
  c = (c.options?.find((o) => o.name === rawCommand.subCommand) as typeof c | undefined) ?? c;
 }

 return `${c.description}${
  c.options?.length
   ? `\n${c.options
      ?.map(
       (o) =>
        `${util.makeInlineCode(o.name + ('required' in o && o.required ? '' : '?'))}: ${
         o.description
        }`,
      )
      .join('\n')}`
   : ''
 }`;
};

/**
 * Returns the description of a command or subcommand group in the specified language.
 * @param language - The language to get the description in.
 * @param command - The name of the command to get the description for.
 * @param subCommandGroup - Optional. The name of the subcommand group to get the description for.
 * @returns The description of the command or subcommand group in the specified language.
 */
const getDescription = (language: CT.Language, command: string, subCommandGroup?: string) => {
 const cJSON = SlashCommands.public[command as keyof typeof SlashCommands.public].toJSON();
 const c = (() => {
  if (subCommandGroup) return cJSON.options?.find((o) => o.name === subCommandGroup) ?? cJSON;
  return cJSON;
 })();

 if ('description' in c) return c.description;
 if (c.type === Discord.ApplicationCommandType.Message) {
  return language.contextCommands.message[command as keyof typeof language.contextCommands.message]
   ?.desc;
 }
 if (cJSON.type === Discord.ApplicationCommandType.User) {
  return language.contextCommands.user[command as keyof typeof language.contextCommands.user]?.desc;
 }
 return '';
};

/**
 * Helper function to generate a message payload for a slash command
 * or string select menu interaction.
 * @param cmd - The slash command or string select menu interaction.
 * @param type - The command category type.
 * @returns A message payload containing embeds and components for the interaction.
 */
export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.StringSelectMenuInteraction,
 type: CT.CommandCategories,
) => {
 const rawCommands = Object.entries(SlashCommands.categories)
  .filter(([, val]) => val === type)
  .map(([k]) => k);
 const commandArgs = rawCommands.map((k) => k.split(/_/g));
 const commands = commandArgs
  .map((k) => {
   if (k.length === 3) {
    return {
     parentCommand: k.at(0) as string,
     subCommandGroup: k.at(1) as string,
     subCommand: k.at(2) as string,
    };
   }
   if (k.length === 2) return { parentCommand: k.at(0) as string, subCommand: k.at(1) as string };
   return { parentCommand: k.at(0) as string };
  })
  .filter((c) => !!c);

 const commandsWithSubCommandsOrSubCommandGroups = commands.filter(
  (c) => c.subCommand || c.subCommandGroup,
 );
 const parentCommands = commandsWithSubCommandsOrSubCommandGroups.map((c) => c.parentCommand);
 const uniqueParentCommands = [...new Set(parentCommands)].filter((s): s is string => !!s);

 const subCommandGroupsWithSubCommands = commandsWithSubCommandsOrSubCommandGroups.filter(
  (c) => c.subCommandGroup && c.subCommand,
 );
 const uniqueSubCommandGroupsWithSubCommands = subCommandGroupsWithSubCommands.filter(
  (value, index, self) =>
   index ===
   self.findIndex(
    (t) => t.parentCommand === value.parentCommand && t.subCommandGroup === value.subCommandGroup,
   ),
 );

 const language = await getLanguage(cmd.guildId);

 const payload: CT.UsualMessagePayload = {
  embeds: getEmbeds(
   cmd,
   language,
   commands,
   uniqueParentCommands,
   uniqueSubCommandGroupsWithSubCommands,
   type,
  ),
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.StringSelect,
      custom_id: 'help/select',
      placeholder: language.slashCommands.help.selectPlaceholder,
      options: [...new Set(Object.values(SlashCommands.categories))].map((c) => ({
       label: language.slashCommands.help.categories[c as CT.CommandCategories],
       value: c,
       default: c === type,
      })),
     },
    ],
   },
  ],
 };

 if (cmd instanceof Discord.ChatInputCommandInteraction) {
  replyCmd(cmd, payload);
 } else cmd.update(payload);
};

/**
 * Returns an array of embeds to be used in a help command response.
 * @param cmd
 * - The command interaction that triggered the help command.
 * @param language
 * - The language object containing localized strings.
 * @param commands
 * - An array of all available commands.
 * @param uniqueParentCommands
 * - An array of unique parent commands.
 * @param uniqueSubCommandGroupsWithSubCommands
 * - An array of unique subcommand groups with subcommands.
 * @param type
 * - The type of command category to display.
 * @returns An array of embeds to be used in a help command response.
 */
const getEmbeds = (
 cmd: Discord.ChatInputCommandInteraction | Discord.StringSelectMenuInteraction,
 language: CT.Language,
 commands: Command[],
 uniqueParentCommands: string[],
 uniqueSubCommandGroupsWithSubCommands: Command[],
 type: CT.CommandCategories,
) => {
 const lan = language.slashCommands.help;
 const fetchedCommands = cmd.client.application.commands.cache;

 const embed: Discord.APIEmbed = {
  color: constants.colors.base,
  title: lan.categories[type as keyof typeof lan.categories],
  description: '',
 };

 const fields = commands
  .map((rawCommand) => {
   const command = fetchedCommands.find((c) => c.name === rawCommand.parentCommand);
   if (!command) return undefined;

   const getCommandMention = () => {
    switch (command.type) {
     case Discord.ApplicationCommandType.Message: {
      return `${constants.standard.getEmote(emotes.Message)} ${rawCommand.parentCommand}`;
     }
     case Discord.ApplicationCommandType.User: {
      return `${constants.standard.getEmote(emotes.MemberBright)} ${rawCommand.parentCommand}`;
     }
     case Discord.ApplicationCommandType.ChatInput:
     default: {
      return `</${`${rawCommand.parentCommand} ${rawCommand.subCommandGroup ?? ''} ${
       rawCommand.subCommand ?? ''
      }`
       .trim()
       .replace(/\s+/g, ' ')}:${command.id}>`;
     }
    }
   };

   return {
    name: '\u200b',
    value: `> ${getCommandMention()}\n${getDesc(command, rawCommand)}`,
    inline: false,
   };
  })
  .filter((f): f is { name: string; value: string; inline: boolean } => !!f);

 const fieldChunks: {
  name: string;
  value: string;
  inline: boolean;
 }[][] = [[]];
 let lastI = 0;
 while (fields.length) {
  const field = fields.shift();
  if (fieldChunks[lastI].length === 26) {
   fieldChunks.push([]);
   lastI += 1;
  }

  if (field) fieldChunks[lastI].push(field);
 }

 const embeds: (typeof embed)[] = [embed];
 while (fieldChunks.length) {
  const fieldChunk = fieldChunks.shift();

  embeds.push({
   color: constants.colors.base,
   description: fieldChunk?.shift()?.value ?? '\u200b',
   fields: fieldChunk ?? [],
   footer: {
    text: lan.footer,
   },
  });
 }

 if (uniqueParentCommands.length) {
  embed.description += `${lan.parentCommands}\n${uniqueParentCommands
   .map((c) => `${util.makeInlineCode(c)}: ${getDescription(language, c)}`)
   .join('\n')}\n\n`;
 }

 if (uniqueSubCommandGroupsWithSubCommands.length) {
  embed.description += `${lan.subCommandGroups}\n${uniqueSubCommandGroupsWithSubCommands
   .map(
    (c) =>
     `${util.makeInlineCode(`${c.parentCommand} ${c.subCommandGroup as string}`)}: ${getDescription(
      language,
      c.parentCommand as string,
      c.subCommandGroup,
     )}`,
   )
   .join('\n')}`;
 }

 if (!embed.description?.length) delete embed.description;
 return embeds;
};
