import type * as Discord from 'discord.js';
import { glob } from 'glob';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isButton()) return;

 const files = await glob(`${process.cwd()}/dist/Commands/**/*`);

 log(cmd.customId);
 const args = cmd.customId.split(/_+/g);
 const path = `Commands/ButtonCommands/${args.shift()}.js`;
 if (!path) return;

 const command = files.find((f) => f.endsWith(path));
 if (!command) return;

 const pathArray = path.replace(`${process.cwd()}/dist/`, '').slice(0, -3).split(/\//g);
 type TempObj = { [k: string]: TempObj };
 let tempObj: TempObj = cmd.client.util.importCache as unknown as TempObj;
 pathArray.forEach((pathSegment) => {
  tempObj = tempObj[pathSegment];
 });

 (
  tempObj as unknown as {
   file: { default: (c: typeof cmd, args: string[]) => void };
  }
 ).file.default(cmd, args);
};
