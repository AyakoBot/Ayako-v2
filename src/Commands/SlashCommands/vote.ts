import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.vote;

 ch.replyCmd(cmd, {
  embeds: [
   {
    author: {
     name: lan.desc,
    },
    description: lan.content,
    color: ch.colorSelector(cmd.guild?.members.me),
   },
  ],
 });
};
