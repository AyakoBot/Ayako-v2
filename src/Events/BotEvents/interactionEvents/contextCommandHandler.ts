import * as Discord from 'discord.js';
import { glob } from 'glob';

// TODO: Fix this
// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isContextMenuCommand()) return;

 const files = await glob(
  `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/**/*`,
 );

 const path = `${Discord.ApplicationCommandType[cmd.commandType]}/${cmd.commandName
  .replace(/\s+/g, '-')
  .toLowerCase()}`;

 log(path);

 const command = files.find((f) => f.endsWith(`/ContextCommands/${path}.js`));
 if (!command) return;

 cmd.client.util.DataBase.commandUsage
  .create({
   data: {
    command: path,
    timestamp: Date.now(),
    type: cmd.type,
    guildId: cmd.guildId,
    userId: cmd.user.id,
    context: cmd.inCachedGuild() && cmd.inGuild() ? 0 : 1,
   },
  })
  .then();

 (await import(command)).default(cmd);
};
