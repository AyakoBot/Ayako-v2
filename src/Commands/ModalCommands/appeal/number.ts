import type { ModalSubmitInteraction } from 'discord.js';
import text from './text.js';

export default (cmd: ModalSubmitInteraction, args: string[]) => text(cmd, args, 'number');
