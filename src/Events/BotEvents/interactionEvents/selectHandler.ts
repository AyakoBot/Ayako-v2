import type * as Discord from 'discord.js';
import { glob } from 'glob';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isAnySelectMenu()) return;

 const getType = () => {
  switch (true) {
   case cmd.isChannelSelectMenu(): {
    return 'Channel';
   }
   case cmd.isRoleSelectMenu(): {
    return 'Role';
   }
   case cmd.isUserSelectMenu(): {
    return 'User';
   }
   case cmd.isStringSelectMenu(): {
    return 'String';
   }
   case cmd.isMentionableSelectMenu(): {
    return 'Mention';
   }
   default: {
    throw new Error(`Unknown Select Menu\n${JSON.stringify(cmd, null, 2)}`);
   }
  }
 };

 const files = await glob(`${process.cwd()}/dist/Commands/SelectCommands/**/*`);

 const args = cmd.customId.split(/_+/g);
 const path = `Commands/${getType()}Select/${args.shift()}.js`;
 const command = files.find((f) => f.endsWith(path));

 log(path);

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
