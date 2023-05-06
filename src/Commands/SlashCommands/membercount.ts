import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inGuild()) return;
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.membercount;

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  color: ch.colorSelector(cmd.guild?.members.me),
  description: `${language.Members} ${cmd.guild?.memberCount}`,
 };

 ch.replyCmd(cmd, {
  embeds: [embed],
 });
};
