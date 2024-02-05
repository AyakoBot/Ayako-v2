import * as Discord from 'discord.js';
import { glob } from 'glob';
import type * as CT from '../../../Typings/Typings.js';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isAutocomplete()) return;
 if (!cmd.inCachedGuild()) return;

 const files = await glob(`${process.cwd()}/dist/Commands/**/*`);

 const subcommandGroup = cmd.options.data.find(
  (c) => c.type === Discord.ApplicationCommandOptionType.SubcommandGroup,
 );
 const subcommand = (subcommandGroup?.options ?? cmd.options.data).find(
  (c) => c.type === Discord.ApplicationCommandOptionType.Subcommand,
 );

 const path = () => {
  const pathArgs: string[] = [];

  if (cmd.commandName) pathArgs.push(cmd.commandName);
  if (subcommandGroup?.name) pathArgs.push(subcommandGroup?.name);
  if (subcommand?.name) pathArgs.push(subcommand?.name);

  return `Commands/AutocompleteCommands/${pathArgs.join('/')}.js`;
 };

 log(path());

 const command = files.find((f) => f.endsWith(path()));
 if (!command) return;

 const pathArray = path().replace(`${process.cwd()}/dist/`, '').slice(0, -3).split(/\//g);
 type TempObj = { [k: string]: TempObj };
 let tempObj: TempObj = cmd.client.util.importCache as unknown as TempObj;
 pathArray.forEach((pathSegment) => {
  tempObj = tempObj[pathSegment];
 });

 const responses = await (tempObj as unknown as { file: CT.AutoCompleteFile }).file.default(cmd);

 cmd.respond(responses ?? []);
};
