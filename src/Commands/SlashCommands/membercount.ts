import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.membercount;

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  color: ch.colorSelector(await ch.getBotMemberFromGuild(cmd.guild)),
  description: `${language.Members} ${ch.util.makeInlineCode(
   ch.splitByThousand(cmd.guild?.memberCount ?? 0),
  )}`,
  fields: [
   {
    name: '\u200b',
    value: lan.field,
   },
  ],
 };

 ch.replyCmd(cmd, {
  embeds: [embed],
 });
};
