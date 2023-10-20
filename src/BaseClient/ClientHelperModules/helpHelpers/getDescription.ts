import * as Discord from 'discord.js';
import SlashCommands from '../../../Events/readyEvents/startupTasks/SlashCommands.js';
import * as CT from '../../../Typings/CustomTypings.js';

/**
 * Returns the description of a command or subcommand group in the specified language.
 * @param language - The language to get the description in.
 * @param command - The name of the command to get the description for.
 * @param subCommandGroup - Optional. The name of the subcommand group to get the description for.
 * @returns The description of the command or subcommand group in the specified language.
 */
export default (language: CT.Language, command: string, subCommandGroup?: string) => {
 const cJSON = Object.values(SlashCommands.public)
  ?.find((c) => c.name === command)
  ?.toJSON();
 if (!cJSON) return '';

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
