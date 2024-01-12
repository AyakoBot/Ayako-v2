import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default (cmd: Discord.ChatInputCommandInteraction) =>
 cmd.client.util.helpHelpers(cmd, CT.CommandCategories.Channels);
