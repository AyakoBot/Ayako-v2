import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const blocked = await cmd.client.util.DataBase.blockedusers.findMany({
  where: { userid: cmd.user.id },
 });

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.rp;
 const allCommands = cmd.client.util.constants.commands.interactions
  .filter((c) => c.users)
  .filter((c) => !c.aliasOf);

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.allBlockedUsers,
  },
  description: `${blocked
   .map((b) =>
    b.blockeduserid === '0'
     ? `${lan.globalBlocked}\n${
        lan.blockedCmds
       } ${b.blockedcmd?.length || 0}/${allCommands.length}\n`
     : `<@${b.blockeduserid}> / ${cmd.client.util.util.makeInlineCode(b.blockeduserid)}\n${
        lan.blockedCmds
       } ${b.blockedcmd?.length || allCommands.length}/${allCommands.length}\n`,
   )
   .join('\n')}`,
  color: cmd.guild
   ? cmd.client.util.getColor(await cmd.client.util.getBotMemberFromGuild(cmd.guild))
   : cmd.client.util.Colors.Base,
 };

 cmd.client.util.replyCmd(cmd, { embeds: [embed] });
};
