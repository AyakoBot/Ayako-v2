import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const user = cmd.options.getUser('user', false) || cmd.user;
 const member = cmd.guild?.members.cache.get(user.id);
 const language = await cmd.client.util.getLanguage(cmd.guildId);

 cmd.client.util.replyCmd(cmd, {
  embeds: (
   [
    {
     author: {
      name: cmd.client.util.constants.standard.user(user),
     },
     image: user.avatar
      ? {
         url: user.displayAvatarURL({ size: 4096 }) as string,
        }
      : undefined,
     description: user.avatar ? undefined : language.t.None,
     color: cmd.client.util.getColor(
      cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
     ),
    },
    member && member.avatar
     ? {
        image: member.avatar
         ? {
            url: member.displayAvatarURL({ size: 4096 }) as string,
           }
         : undefined,
        description: member.avatar ? undefined : language.t.None,
        color: cmd.client.util.getColor(
         cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
        ),
       }
     : undefined,
   ] as Discord.APIEmbed[]
  ).filter((r): r is Discord.APIEmbed => !!r),
 });
};
