import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { end } from '../../SlashCommands/giveaway/end.js';
import { checkCommandPermissions } from '../../../Events/messageEvents/messageCreate/commandHandler.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const messageID = args.shift() as string;
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.end;
 const giveaway = await ch.DataBase.giveaways.findUnique({
  where: { msgid: messageID, ended: true },
 });

 if (!giveaway || giveaway.guildid !== cmd.guildId) {
  ch.errorCmd(cmd, language.slashCommands.giveaway.notFoundOrEnded, language);
  return;
 }

 if (
  !checkCommandPermissions(
   {
    guildId: cmd.guildId,
    guild: cmd.guild,
    author: cmd.user,
    channelId: cmd.channelId,
    member: cmd.member,
   },
   'giveaway',
  )
 ) {
  ch.errorCmd(cmd, language.permissions.error.you, language);
  return;
 }

 await ch.request.channels.deleteMessage(cmd.message);

 await end(giveaway);

 ch.replyCmd(cmd, { content: lan.rerolling });
};
