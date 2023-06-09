import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default (msg: Discord.Message) => ch.interactionHelpers(msg, msg.guild);
