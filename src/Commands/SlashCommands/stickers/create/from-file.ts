import * as Discord from 'discord.js';
import fromFile from '../../emojis/create/from-file.js';

export default (cmd: Discord.ChatInputCommandInteraction<'cached'>, args: string[]) =>
 fromFile(cmd, args, 'sticker');
