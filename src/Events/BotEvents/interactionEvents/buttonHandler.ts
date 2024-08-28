import type * as Discord from 'discord.js';
import { glob } from 'glob';
import { metricsCollector } from '../../../BaseClient/Bot/Metrics.js';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isButton()) return;

 const files = await glob(
  `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/**/*`,
 );

 log(cmd.customId);
 const args = cmd.customId.split(/_+/g);
 const path = args.shift();

 const command = files.find((f) => f.endsWith(`/ButtonCommands/${path}.js`));
 if (!command || !path) return;

 metricsCollector.cmdExecuted(
  path,
  cmd.type,
  cmd.inCachedGuild() && cmd.inGuild() ? 0 : 1,
  cmd.guildId ?? undefined,
 );

 (await import(command)).default(cmd, args);
};
