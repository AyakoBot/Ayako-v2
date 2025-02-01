import type { ModalSubmitInteraction } from 'discord.js';
import xp from './xp.js';

export default (cmd: ModalSubmitInteraction, args: string[]) => xp(cmd, args, 'lvl');
