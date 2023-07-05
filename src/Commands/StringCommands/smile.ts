import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export const requiresSlashCommand = true;
export default (msg: Discord.Message) => ch.interactionHelpers(msg, msg.guild);
