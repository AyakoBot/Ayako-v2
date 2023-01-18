import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (user: DDeno.User, member: DDeno.Member | undefined, guild: DDeno.Guild) => {
  const channels = await client.ch.getLogChannels('guildevents', { guildId: guild.id });
  if (!channels) return;

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.guild;
  const audit = user.toggles.bot ? await client.ch.getAudit(guild, 20, user.id) : undefined;
  const auditUser =
    audit && audit?.userId ? await client.ch.cache.users.get(audit?.userId) : undefined;
  let description = '';

  if (user.toggles.bot) {
    if (audit && auditUser) description = lan.descBotLeaveAudit(user, auditUser);
    else description = lan.descBotLeave(user);
  } else if (audit && auditUser) description = lan.descMemberLeaveAudit(user, auditUser);
  else description = lan.descMemberLeave(user);

  let name = user.toggles.bot ? lan.botJoin : lan.memberJoin;
  if (audit) name = user.toggles.bot ? lan.botKick : lan.memberKick;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: user.toggles.bot ? con.BotDelete : con.MemberDelete,
      name,
    },
    description,
    fields: [],
    color: client.customConstants.colors.warning,
  };

  if (member) {
    embed.fields?.push(
      {
        name: language.roles,
        value: member.roles.map((r) => `<@&${r}>`).join(', '),
      },
      {
        name: language.joinedAt,
        value: client.customConstants.standard.getTime(member.joinedAt),
      },
    );
  }

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
