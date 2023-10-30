import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.vote;

 ch.replyCmd(cmd, {
  embeds: [
   {
    author: {
     name: lan.desc,
    },
    description: lan.content,
    color: ch.getColor(cmd.guild ? await ch.getBotMemberFromGuild(cmd.guild) : undefined),
   },
  ],
 });
};
