import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const user = cmd.options.getUser('user', false) || cmd.user;

 const language = await ch.languageSelector(cmd.guildId);

 ch.replyCmd(cmd, {
  embeds: [
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
  ],
 });
};
