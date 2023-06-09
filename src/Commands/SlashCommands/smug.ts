import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default (cmd: Discord.ChatInputCommandInteraction) => ch.interactionHelpers(cmd, cmd.guild);
