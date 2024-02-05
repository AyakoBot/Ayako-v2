import * as Discord from 'discord.js';
import { glob } from 'glob';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isContextMenuCommand()) return;

 const files = await glob(`${process.cwd()}/dist/Commands/**/*`);

 const path = `Commands/ContextCommands/${
  Discord.ApplicationCommandType[cmd.commandType]
 }/${cmd.commandName.replace(/\s+/g, '-').toLowerCase()}.js`;

 log(path);

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
   file: { default: (c: typeof cmd) => void };
  }
 ).file.default(cmd);
};
