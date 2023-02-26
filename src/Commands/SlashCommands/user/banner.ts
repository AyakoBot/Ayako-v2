import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  const userID = cmd.options.get('user-name', false)?.value as string | null;
  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.user.banner;

  if (userID && userID.replace(/\D+/g, '').length !== userID.length) {
    ch.errorCmd(cmd, language.errors.userNotFound, language);
    return;
  }

  const user =
    cmd.options.getUser('user', false) ??
    (userID ? await client.users.fetch(userID).catch(() => undefined) : cmd.user) ??
    cmd.user;

  if (!user) {
    ch.errorCmd(cmd, language.errors.userNotFound, language);
    return;
  }

  const banner = (await user.fetch()).bannerURL({ size: 4096 });

  const embeds: Discord.APIEmbed[] = [
    {
      author: {
        name: user.bot ? lan.authorBot(user) : lan.authorUser(user),
      },
      image: banner ? { url: banner } : undefined,
      color: ch.colorSelector(cmd.guild?.members.me),
    },
  ];

  const member = await cmd.guild?.members.fetch(user.id).catch(() => undefined);
  if (member) {
    embeds.push({
      author: {
        name: lan.authorMember(user),
      },
      description: lan.guildBannerFail,
      color: ch.colorSelector(cmd.guild?.members.me),
    });
  }

  cmd.reply({ embeds, ephemeral: true });
};
