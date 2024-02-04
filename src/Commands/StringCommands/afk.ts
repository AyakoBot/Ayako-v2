import * as Discord from 'discord.js';
import type * as CT from '../../Typings/Typings.js';

export const takesFirstArg = false;
export const thisGuildOnly = [];
export const dmOnly = false;
export const dmAllowed = false;
export const type: CT.Command<typeof dmAllowed>['type'] = 'mod';
export const requiresSlashCommand = true;

const cmd: CT.Command<typeof dmAllowed>['default'] = async (msg, args) =>
 msg.client.util.importCache.Commands.SlashCommands.afk.file.default(
  msg as Discord.Message<true>,
  args?.join(' ') ?? undefined,
 );

export default cmd;
