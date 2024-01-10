import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import constants from '../../Other/constants.js';
import cache from '../cache.js';
import emotes from '../emotes.js';
import * as util from '../util.js';

import getDesc from './getDesc.js';
import getDescription from './getDescription.js';

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
export default (
 cmd: Discord.ChatInputCommandInteraction | Discord.StringSelectMenuInteraction,
 language: CT.Language,
 commands: CT.HelpCommand[],
 uniqueParentCommands: string[],
 uniqueSubCommandGroupsWithSubCommands: CT.HelpCommand[],
 type: CT.CommandCategories,
) => {
 const lan = language.slashCommands.help;
 const guildCommands = cmd.guildId
  ? [...[...(cache.commands.cache.get(cmd.guildId)?.values() ?? [])].filter((c) => !c.guildId)]
  : [];
 const globalCommands = cmd.client.application.commands.cache.map((c) => c);

 const fetchedCommands = cmd.guildId && guildCommands.length ? guildCommands : globalCommands;

 const embed: Discord.APIEmbed = {
  color: CT.Colors.Base,
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
   color: CT.Colors.Base,
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
