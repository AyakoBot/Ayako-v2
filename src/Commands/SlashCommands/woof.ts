import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default (cmd: Discord.ChatInputCommandInteraction<'cached'>) => ch.interactionHelpers(cmd, cmd.guild);
