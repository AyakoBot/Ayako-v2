import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.vote;

 cmd.client.util.replyCmd(cmd, {
  embeds: [
   {
    author: {
     name: lan.desc,
    },
    description: lan.content,
    color: cmd.client.util.getColor(
     cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
    ),
   },
  ],
 });
};
