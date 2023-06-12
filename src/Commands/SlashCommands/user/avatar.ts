import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const user = cmd.options.getUser('user', false) || cmd.user;
 const member = cmd.guild?.members.cache.get(user.id);

 const language = await ch.languageSelector(cmd.guildId);

 ch.replyCmd(cmd, {
  embeds: (
   [
    {
     author: {
      name: user.tag,
     },
     image: user.avatar
      ? {
         url: user.displayAvatarURL({ size: 4096 }) as string,
        }
      : undefined,
     description: user.avatar ? undefined : language.None,
     color: ch.colorSelector(cmd.guild?.members.me),
    },
    member
     ? {
        image: member.avatar
         ? {
            url: member.displayAvatarURL({ size: 4096 }) as string,
           }
         : undefined,
        description: member.avatar ? undefined : language.None,
        color: ch.colorSelector(cmd.guild?.members.me),
       }
     : undefined,
   ] as Discord.APIEmbed[]
  ).filter((r): r is Discord.APIEmbed => !!r),
 });
};
