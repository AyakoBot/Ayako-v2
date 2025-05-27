import type { ButtonInteraction } from 'discord.js';
import shopCmd from '../../../SlashCommands/shop.js';

export default (cmd: ButtonInteraction, args: string[]) => shopCmd(cmd, args);
