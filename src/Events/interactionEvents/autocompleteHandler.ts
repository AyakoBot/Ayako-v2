import * as Discord from 'discord.js';
import glob from 'glob';
import type * as CT from '../../Typings/CustomTypings';

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isAutocomplete()) return;

 const files: string[] = await new Promise((resolve) => {
  glob(`${process.cwd()}/Commands/AutocompleteCommands/**/*`, (err, res) => {
   if (err) throw err;
   resolve(res);
  });
 });

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

  return pathArgs.join('/');
 };

 console.log(path());

 const command = files.find((f) => f.endsWith(`/${path()}.js`));
 if (!command) return;

 const responses = await ((await import(command)) as CT.AutoCompleteFile).default(cmd);

 cmd.respond(responses ?? []);
};
