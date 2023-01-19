import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (ban: Discord.GuildBan) => {
  const channels = await client.ch.getLogChannels('guildevents', ban.guild);
  if (!channels) return;

  if (ban.partial) await ban.fetch();

  const language = await client.ch.languageSelector(ban.guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(ban.guild, 22, ban.user.id);
  const auditUser = audit?.executor ?? undefined;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.BanCreate,
      name: lan.ban,
    },
    description: auditUser ? lan.descBanAudit(ban.user, auditUser) : lan.descBan(ban.user),
    fields: [],
    color: client.customConstants.colors.success,
  };

  if (ban && ban.reason) embed.fields?.push({ name: language.reason, value: ban.reason });

  client.ch.send(
    { id: channels, guildId: ban.guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
