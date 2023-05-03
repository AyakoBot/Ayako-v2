import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import client from '../../../../BaseClient/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  const userID = cmd.options.get('user-name', false)?.value as string | null;
  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.user.avatar;

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

  const embeds: Discord.APIEmbed[] = [
    {
      author: {
        name: user.bot ? lan.authorBot(user) : lan.authorUser(user),
      },
      image: { url: user.displayAvatarURL({ size: 4096 }) },
      color: ch.colorSelector(cmd.guild?.members.me),
    },
  ];

  const member = await cmd.guild?.members.fetch(user.id).catch(() => undefined);
  if (member) {
    const hasAvatar = !!member.avatar;

    embeds.push({
      author: {
        name: lan.authorMember(user),
      },
      image: hasAvatar ? { url: member.displayAvatarURL({ size: 4096 }) } : undefined,
      description: hasAvatar ? undefined : language.None,
      color: ch.colorSelector(cmd.guild?.members.me),
    });
  }

  cmd.reply({ embeds, ephemeral: true });
};
