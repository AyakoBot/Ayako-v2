import type * as Discord from 'discord.js';
import glob from 'glob';

export default async (cmd: Discord.Interaction) => {
  if (!cmd.isButton()) return;

  const files: string[] = await new Promise((resolve) => {
    glob(`${process.cwd()}/Commands/ButtonCommands/**/*`, (err, res) => {
      if (err) throw err;
      resolve(res);
    });
  });

  console.log(cmd.customId);
  const args = cmd.customId.split(/_+/g);
  const path = args.shift();

  const command = files.find((f) => f.endsWith(`/${path}.js`));
  if (!command) return;

  (await import(command)).default(cmd, args);
};
