import { ChatInputCommandInteraction } from 'discord.js';
import member from './member.js';

export default async (cmd: ChatInputCommandInteraction) => member(cmd, 'manager', 'promote');
