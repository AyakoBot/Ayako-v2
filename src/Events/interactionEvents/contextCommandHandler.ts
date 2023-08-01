import * as Discord from 'discord.js';
import { glob } from 'glob';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isMessageContextMenuCommand()) return;

 const files = await glob(`${process.cwd()}/Commands/**/*`);

 const path = `/${Discord.ApplicationCommandType[cmd.commandType]}/${cmd.commandName
  .replace(/\s+/g, '-')
  .toLowerCase()}`;

 log(path);

 const command = files.find((f) => f.endsWith(`/ContextCommands/${path}.js`));
 if (!command) return;

 (await import(command)).default(cmd);
};
