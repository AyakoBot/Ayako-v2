import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default (cmd: Discord.ChatInputCommandInteraction) =>
 ch.helpHelpers(cmd, CT.CommandCategories.Moderation);
