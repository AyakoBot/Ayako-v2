import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', false) || cmd.user;
 const member = cmd.guild?.members.cache.get(user.id);
 const language = await ch.getLanguage(cmd.guildId);

 ch.replyCmd(cmd, {
  embeds: (
   [
    {
     author: {
      name: ch.constants.standard.user(user),
     },
     image: user.avatar
      ? {
         url: user.displayAvatarURL({ size: 4096 }) as string,
        }
      : undefined,
     description: user.avatar ? undefined : language.None,
     color: ch.getColor(cmd.guild ? await ch.getBotMemberFromGuild(cmd.guild) : undefined),
    },
    member && member.avatar
     ? {
        image: member.avatar
         ? {
            url: member.displayAvatarURL({ size: 4096 }) as string,
           }
         : undefined,
        description: member.avatar ? undefined : language.None,
        color: ch.getColor(cmd.guild ? await ch.getBotMemberFromGuild(cmd.guild) : undefined),
       }
     : undefined,
   ] as Discord.APIEmbed[]
  ).filter((r): r is Discord.APIEmbed => !!r),
 });
};
