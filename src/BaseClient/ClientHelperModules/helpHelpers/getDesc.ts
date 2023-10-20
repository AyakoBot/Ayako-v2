import * as Discord from 'discord.js';
import * as util from '../util.js';

/**
 * Returns the description of a command along with its options.
 * @param command - The command to get the description of.
 * @param rawCommand - An object containing the parent command and any subcommands
 * or subcommand groups.
 * @returns The description of the command and its options, if any.
 */
export default (
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
