import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import setLevelUser from '../../../SlashCommands/settings/leveling/set-level-user.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const userId = args.shift() as string;
 const language = await ch.getLanguage(cmd.guildId);
 const user = await ch.getUser(userId);
 if (!user) {
  ch.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 setLevelUser(cmd, args, user);
};
