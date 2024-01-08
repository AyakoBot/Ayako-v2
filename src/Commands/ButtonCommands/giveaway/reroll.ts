import * as Discord from 'discord.js';
import { checkCommandPermissions } from '../../../Events/messageEvents/messageCreate/commandHandler.js';
import { end } from '../../SlashCommands/giveaway/end.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const messageID = args.shift() as string;
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.end;
 const giveaway = await cmd.client.util.DataBase.giveaways.findUnique({
  where: { msgid: messageID, ended: true },
 });

 if (!giveaway || giveaway.guildid !== cmd.guildId) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.giveaway.notFoundOrEnded, language);
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
  cmd.client.util.errorCmd(cmd, language.permissions.error.you, language);
  return;
 }

 await cmd.client.util.request.channels.deleteMessage(cmd.message);

 await end(giveaway);

 cmd.client.util.replyCmd(cmd, { content: lan.rerolling });
};
