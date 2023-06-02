import * as Discord from 'discord.js';
import SlashCommands from '../../Events/readyEvents/startupTasks/SlashCommands.js';
import type * as CT from '../../Typings/CustomTypings.js';
import * as util from './util.js';
import replyCmd from './replyCmd.js';
import languageSelector from './languageSelector.js';
import constants from '../Other/constants.js';

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

const getDesc = (
 command: Discord.ApplicationCommand,
 rawCommand: { parentCommand: string; subCommandGroup?: string; subCommand?: string },
) => {
 let c: {
  options: Discord.ApplicationCommandOption[];
  description: string;
  name: string;
 } = command;

 if (rawCommand.subCommandGroup) {
  c = (c.options?.find((o) => o.name === rawCommand.subCommandGroup) as typeof c) ?? c;
 }

 if (rawCommand.subCommand) {
  c = (c.options?.find((o) => o.name === rawCommand.subCommand) as typeof c) ?? c;
 }

 return `${c.description}${
  c.options?.length
   ? `\n${c.options
      ?.map(
       (o) =>
        `${util.makeInlineCode(o.name + ('required' in o && o.required ? '?' : ''))}: ${
         o.description
        }`,
      )
      .join('\n')}`
   : ''
 }`;
};

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

 const language = await languageSelector(cmd.guildId);

 const payload: Discord.InteractionReplyOptions | Discord.InteractionUpdateOptions = {
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
      customId: 'help/select',
      placeholder: language.slashCommands.help.selectPlaceholder,
      options: [...new Set(Object.values(SlashCommands.categories))].map((c) => ({
       label:
        language.slashCommands.help.categories[
         c as keyof typeof language.slashCommands.help.categories
        ],
       value: c,
       default: c === type,
      })),
     },
    ],
   },
  ],
 };

 if (cmd instanceof Discord.ChatInputCommandInteraction) {
  replyCmd(cmd, payload as Discord.InteractionReplyOptions);
 } else cmd.update(payload as Discord.InteractionUpdateOptions);
};

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

   return {
    name: '\u200b',
    value: `> </${`${rawCommand.parentCommand} ${rawCommand.subCommandGroup ?? ''} ${
     rawCommand.subCommand ?? ''
    }`
     .trim()
     .replace(/\s+/g, ' ')}:${command.id}>\n${getDesc(command, rawCommand)}`,
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
