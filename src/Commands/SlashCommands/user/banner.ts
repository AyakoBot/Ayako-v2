import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const rawUser = cmd.options.getUser('user', false) || cmd.user;
 const language = await ch.languageSelector(cmd.guildId);
 const user = await rawUser.fetch(true);

 ch.replyCmd(cmd, {
  embeds: [
   {
    author: {
     name: ch.constants.standard.user(user),
    },
    image: user.banner
     ? {
        url: user.bannerURL({ size: 4096 }) as string,
       }
     : undefined,
    description: user.banner ? undefined : language.None,
    color: ch.colorSelector(await ch.getBotMemberFromGuild(cmd.guild)),
   },
  ],
 });
};
