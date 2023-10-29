import type * as Discord from 'discord.js';
import startOver from './startOver.js';

export default (cmd: Discord.ButtonInteraction) => startOver(cmd, [], cmd.message.embeds[1].data);
