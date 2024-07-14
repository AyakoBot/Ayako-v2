import * as Discord from 'discord.js';
import all from './all.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => all(cmd, [], 'images');
