import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const blocked = await ch.DataBase.blockedusers.findMany({
  where: { userid: cmd.user.id },
 });

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.rp;
 const allCommands = ch.constants.commands.interactions
  .filter((c) => c.users)
  .filter((c) => !c.aliasOf);

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.allBlockedUsers,
  },
  description: `${blocked
   .map(
    (b) =>
     `<@${b.blockeduserid}> / ${ch.util.makeInlineCode(b.blockeduserid)}\n${lan.blockedCmds} ${
      b.blockedcmd?.length || allCommands.length
     }/${allCommands.length}\n`,
   )
   .join('\n')}`,
  color: ch.getColor(await ch.getBotMemberFromGuild(cmd.guild)),
 };

 ch.replyCmd(cmd, { embeds: [embed] });
};
