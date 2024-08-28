import type * as Discord from 'discord.js';
import { glob } from 'glob';
import { metricsCollector } from '../../../BaseClient/Bot/Metrics.js';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isAnySelectMenu()) return;

 const getType = () => {
  switch (true) {
   case cmd.isChannelSelectMenu():
    return 'Channel';
   case cmd.isRoleSelectMenu():
    return 'Role';
   case cmd.isUserSelectMenu():
    return 'User';
   case cmd.isStringSelectMenu():
    return 'String';
   case cmd.isMentionableSelectMenu():
    return 'Mention';
   default:
    throw new Error(`Unknown Select Menu\n${JSON.stringify(cmd, null, 2)}`);
  }
 };

 const files = await glob(
  `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/SelectCommands/**/*`,
 );

 const args = cmd.customId.split(/_+/g);
 const path = args.shift();
 const command = files.find((f) => f.endsWith(`/${getType()}Select/${path}.js`));

 log(path);

 if (!command || !path) return;

 metricsCollector.cmdExecuted(
  path,
  cmd.type,
  cmd.inCachedGuild() && cmd.inGuild() ? 0 : 1,
  cmd.guildId ?? undefined,
 );

 (await import(command)).default(cmd, args);
};
