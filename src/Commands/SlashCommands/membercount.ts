import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.membercount;

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  color: cmd.client.util.getColor(await cmd.client.util.getBotMemberFromGuild(cmd.guild)),
  description: `${language.t.Members} ${cmd.client.util.util.makeInlineCode(
   cmd.client.util.splitByThousand(cmd.guild?.memberCount ?? 0),
  )}`,
  fields: [
   {
    name: '\u200b',
    value: lan.field,
   },
  ],
 };

 cmd.client.util.replyCmd(cmd, {
  embeds: [embed],
 });
};
