import type { ChatInputCommandInteraction } from 'discord.js';
import name, { Origin } from './name.js';

export default (cmd: ChatInputCommandInteraction) => name(cmd, Origin.video);
