import * as Discord from 'discord.js';
import emojis from '../../SlashCommands/info/emoji.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 emojis(cmd, Number(args.shift()));
