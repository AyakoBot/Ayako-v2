import type * as Discord from 'discord.js';
import { glob } from 'glob';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isModalSubmit()) return;

 const files = await glob(
  `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/**/*`,
 );

 const args = cmd.customId.split(/_+/g);
 const path = args.shift();

 log(path);

 const command = files.find((f) => f.endsWith(`/ModalCommands/${path}.js`));
 if (!command || !path) return;

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

 (await import(command)).default(cmd, args);
};
