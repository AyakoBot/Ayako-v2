import * as Discord from 'discord.js';
import glob from 'glob';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isMessageContextMenuCommand()) return;

 const files: string[] = await new Promise((resolve) => {
  glob(`${process.cwd()}/Commands/**/*`, (err, res) => {
   if (err) throw err;
   resolve(res);
  });
 });

 const path = `/${Discord.ApplicationCommandType[cmd.commandType]}/${cmd.commandName
  .replace(/\s+/g, '-')
  .toLowerCase()}`;

 log(path);

 const command = files.find((f) => f.endsWith(`/ContextCommands/${path}.js`));
 if (!command) return;

 (await import(command)).default(cmd);
};
