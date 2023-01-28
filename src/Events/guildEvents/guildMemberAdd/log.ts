import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (member: Discord.GuildMember) => {
  const channels = await client.ch.getLogChannels('memberevents', member.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(member.guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.guild;

  const audit = member.user.bot ? await client.ch.getAudit(member.guild, 28, member.id) : undefined;
  const auditUser = audit?.executor ?? undefined;
  let description = auditUser ? lan.descJoinAudit(member.user, auditUser) : undefined;

  if (!description) {
    description = member.user.bot ? lan.descBotJoin(member.user) : lan.descMemberJoin(member.user);
  }

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: member.user.bot ? con.BotCreate : con.MemberCreate,
      name: member.user.bot ? lan.botJoin : lan.memberJoin,
    },
    description,
    fields: [],
    color: client.customConstants.colors.success,
  };

  const usedInvite = await getUsedInvite(member.guild, member.user);
  if (usedInvite) {
    const inviter =
      usedInvite.inviter ??
      (usedInvite.inviterId ? await client.users.fetch(usedInvite.inviterId) : undefined);

    embed.fields?.push({
      name: lan.invite,
      value: language.languageFunction.getInviteDetails(usedInvite, inviter),
    });
  }

  client.ch.send(
    { id: channels, guildId: member.guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};

const getUsedInvite = async (guild: Discord.Guild, user: Discord.User) => {
  if (user.bot) return undefined;

  const oldInvites = Array.from(client.cache.invites.cache.get(guild.id) ?? [], ([, i]) =>
    Array.from(i, ([, i2]) => i2),
  ).flat();
  const newInvites = await guild.invites.fetch();
  if (!newInvites) return undefined;

  newInvites.forEach((i) => client.cache.invites.set(i, guild.id));
  if (!oldInvites) return undefined;

  return oldInvites
    .map((oldInvite) => {
      const newInvite = newInvites.find((invite) => invite.code === oldInvite.code);
      if (newInvite && Number(oldInvite.uses) < Number(newInvite.uses)) return newInvite;
      return undefined;
    })
    .filter((i): i is Discord.Invite => !!i)[0];
};
