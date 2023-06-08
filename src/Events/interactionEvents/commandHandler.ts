import * as Discord from 'discord.js';
import glob from 'glob';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isChatInputCommand() && !cmd.isCommand()) return;

 const files: string[] = await new Promise((resolve) => {
  glob(`${process.cwd()}/Commands/SlashCommands/**/*`, (err, res) => {
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

 log(path());

 const command = files.find((f) => f.endsWith(`/${path()}.js`));
 if (!command) return;

 (await import(command)).default(cmd);
};
