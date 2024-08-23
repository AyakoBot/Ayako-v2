import * as Discord from 'discord.js';
import { glob } from 'glob';
import { metricsCollector } from '../../../BaseClient/Bot/Metrics.js';

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

 metricsCollector.cmdExecuted(
  path,
  cmd.type,
  cmd.inCachedGuild() && cmd.inGuild() ? 0 : 1,
  cmd.user.id,
  cmd.guildId ?? undefined,
 );

 (await import(command)).default(cmd);
};
