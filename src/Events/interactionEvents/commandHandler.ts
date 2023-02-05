import type * as Discord from 'discord.js';
import glob from 'glob';

export default async (cmd: Discord.Interaction) => {
  if (!cmd.isChatInputCommand() && !cmd.isCommand()) return;

  const files: string[] = await new Promise((resolve) => {
    glob(`${process.cwd()}/Commands/SlashCommands/**/*`, (err, res) => {
      if (err) throw err;
      resolve(res);
    });
  });

  const subcommand = cmd.options.data.find((c) => c.type === 1);

  if (!subcommand) {
    const command = files.find((f) => f.endsWith(`${cmd.commandName}.js`));
    if (!command) return;

    (await import(command)).default(cmd);
    return;
  }

  if (subcommand) {
    const command = files.find((f) => f.endsWith(`${cmd.commandName}/${subcommand.name}.js`));
    if (!command) return;

    (await import(command)).default(cmd);
    return;
  }

  throw new Error(`Unknown Command Type encountered\n${JSON.stringify(cmd)}`);
};
