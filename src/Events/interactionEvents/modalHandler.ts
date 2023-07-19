import type * as Discord from 'discord.js';
import glob from 'glob';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isModalSubmit()) return;

 const files: string[] = await new Promise((resolve) => {
  glob(`${process.cwd()}/Commands/**/*`, (err, res) => {
   if (err) throw err;
   resolve(res);
  });
 });

 const args = cmd.customId.split(/_+/g);
 const path = args.shift();

 log(path);

 const command = files.find((f) => f.endsWith(`/ModalCommands/${path}.js`));
 if (!command) return;

 (await import(command)).default(cmd, args);
};
