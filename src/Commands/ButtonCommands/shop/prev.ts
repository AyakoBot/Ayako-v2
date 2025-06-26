import type { ButtonInteraction } from 'discord.js';
import shop from '../../../Commands/SlashCommands/shop.js';

export default (cmd: ButtonInteraction, args: string[]) => shop(cmd, args);
