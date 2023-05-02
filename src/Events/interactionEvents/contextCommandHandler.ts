import * as Discord from 'discord.js';
import glob from 'glob';

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isMessageContextMenuCommand()) return;

 const files: string[] = await new Promise((resolve) => {
  glob(`${process.cwd()}/Commands/ContextCommands/**/*`, (err, res) => {
   if (err) throw err;
   resolve(res);
  });
 });

 const path = `/${Discord.ApplicationCommandType[cmd.commandType]}/${cmd.commandName
  .replace(/\s+/g, '-')
  .toLowerCase()}`;
 console.log(path);

 const command = files.find((f) => f.endsWith(`${path}.js`));
 if (!command) return;

 (await import(command)).default(cmd);
};
