import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (ban: Discord.GuildBan) => {
  const channels = await client.ch.getLogChannels('guildevents', ban.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(ban.guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(ban.guild, 23, ban.user.id);
  const auditUser = audit?.executor ?? undefined;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.BanRemove,
      name: lan.unban,
    },
    description: auditUser ? lan.descUnbanAudit(ban.user, auditUser) : lan.descUnban(ban.user),
    fields: [],
    color: client.customConstants.colors.success,
  };

  client.ch.send(
    { id: channels, guildId: ban.guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
