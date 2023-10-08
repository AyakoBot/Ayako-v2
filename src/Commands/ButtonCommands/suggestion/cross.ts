import * as Discord from 'discord.js';
import tick from './tick.js';

export default (cmd: Discord.ButtonInteraction) => tick(cmd, [], false);
