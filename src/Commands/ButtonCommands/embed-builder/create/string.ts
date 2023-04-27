import type * as Discord from 'discord.js';
import string from '../../../SelectCommands/StringSelect/embed-builder/create/string.js';

export default (cmd: Discord.ButtonInteraction, args: string[]) => string(cmd, args);
