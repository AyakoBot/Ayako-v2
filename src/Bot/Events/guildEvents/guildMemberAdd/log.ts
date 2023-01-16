import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (_: DDeno.Member, user: DDeno.User, guild: DDeno.Guild) => {
  const channels = await client.ch.getLogChannels('guildevents', { guildId: guild.id });
  if (!channels) return;

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.guild;

  const audit = user.toggles.bot ? await client.ch.getAudit(guild, 28, user.id) : undefined;
  const auditUser =
    audit && audit?.userId ? await client.ch.cache.users.get(audit?.userId) : undefined;
  let description = auditUser ? lan.descJoinAudit(user, auditUser) : undefined;

  if (!description) {
    description = user.toggles.bot ? lan.descBotJoin(user) : lan.descMemberJoin(user);
  }

  const embed: DDeno.Embed = {
    author: {
      iconUrl: user.toggles.bot ? con.BotCreate : con.MemberCreate,
      name: user.toggles.bot ? lan.botJoin : lan.memberJoin,
    },
    description,
    fields: [],
    color: client.customConstants.colors.success,
  };

  const usedInvite = await getUsedInvite(guild, user);
  if (usedInvite) {
    embed.fields?.push({
      name: lan.invite,
      value: language.languageFunction.getInviteDetails(usedInvite, usedInvite.inviter),
    });
  }

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};

const getUsedInvite = async (guild: DDeno.Guild, user: DDeno.User) => {
  if (user.toggles.bot) return undefined;

  const oldInvites = Array.from(client.ch.cache.invites.cache.get(guild.id) ?? [], ([, i]) =>
    Array.from(i, ([, i2]) => i2),
  ).flat();
  const newInvites = await client.helpers.getInvites(guild.id);
  if (!newInvites) return undefined;

  newInvites.forEach((i) => client.ch.cache.invites.set(i));
  if (!oldInvites) {
    return undefined;
  }

  return oldInvites
    .map((oldInvite) => {
      const newInvite = newInvites.find((invite) => invite.code === oldInvite.code);
      if (newInvite && oldInvite.uses === newInvite.uses - 1) return newInvite;
      return undefined;
    })
    .filter((i): i is DDeno.InviteMetadata => !!i)[0];
};
