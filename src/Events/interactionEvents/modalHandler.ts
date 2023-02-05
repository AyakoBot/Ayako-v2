import type * as Discord from 'discord.js';
import glob from 'glob';

export default async (cmd: Discord.Interaction) => {
  if (!cmd.isModalSubmit()) return;

  const files: string[] = await new Promise((resolve) => {
    glob(`${process.cwd()}/Commands/ModalCommands/**/*`, (err, res) => {
      if (err) throw err;
      resolve(res);
    });
  });

  const args = cmd.customId.split(/_+/g);
  const path = args.unshift();

  const command = files.find((f) => f.endsWith(`${path}.js`));
  if (!command) return;

  (await import(command)).default(cmd, args);
};
