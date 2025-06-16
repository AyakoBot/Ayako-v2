import { type ButtonInteraction } from 'discord.js';
import short from './short.js';

export default async (cmd: ButtonInteraction, args: string[]) =>
 short(cmd, args, 'text', 'paragraph');
