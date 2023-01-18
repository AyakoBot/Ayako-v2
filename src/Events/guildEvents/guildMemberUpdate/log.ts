import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (
  member: DDeno.Member,
  user: DDeno.User,
  guild: DDeno.Guild,
  oldMember: DDeno.Member,
) => {
  const channels = await client.ch.getLogChannels('guildmemberevents', { guildId: guild.id });
  if (!channels) return;

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.guild;
  const audit = user.toggles.bot ? await client.ch.getAudit(guild, 20, user.id) : undefined;
  const auditUser =
    audit && audit?.userId ? await client.ch.cache.users.get(audit?.userId) : undefined;
  let description = '';

  if (user.toggles.bot) {
    if (audit && auditUser) description = lan.descBotUpdateAudit(user, auditUser);
    else description = lan.descBotUpdate(user);
  } else if (audit && auditUser) description = lan.descMemberUpdateAudit(user, auditUser);
  else description = lan.descMemberUpdate(user);

  const embed: DDeno.Embed = {
    author: {
      iconUrl: user.toggles.bot ? con.BotUpdate : con.MemberUpdate,
      name: user.toggles.bot ? lan.botUpdate : lan.memberUpdate,
    },
    description,
    fields: [],
    color: client.customConstants.colors.loading,
  };

  const files: DDeno.FileContent[] = [];
  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case member.avatar !== oldMember.avatar: {
      const url = client.ch.getAvatarURL(user, member);
      const blob = (await client.ch.fileURL2Blob([url]))?.[0]?.blob;

      merge(url, user.avatar, 'icon', lan.avatar);

      if (blob) {
        files.push({
          name: String(user.avatar),
          blob,
        });
      }

      break;
    }
    case member.nick !== oldMember.nick: {
      merge(member.nick, oldMember.nick, 'string', language.name);
      break;
    }
    case member.premiumSince !== oldMember.premiumSince: {
      merge(
        member.premiumSince
          ? client.customConstants.standard.getTime(member.premiumSince)
          : language.none,
        oldMember.premiumSince
          ? client.customConstants.standard.getTime(oldMember.premiumSince)
          : language.none,
        'string',
        lan.premiumSince,
      );
      break;
    }
    case member.communicationDisabledUntil !== oldMember.communicationDisabledUntil: {
      merge(
        member.communicationDisabledUntil
          ? client.customConstants.standard.getTime(member.communicationDisabledUntil)
          : language.none,
        oldMember.communicationDisabledUntil
          ? client.customConstants.standard.getTime(oldMember.communicationDisabledUntil)
          : language.none,
        'string',
        lan.communicationDisabledUntil,
      );
      break;
    }
    case JSON.stringify(member.roles) !== JSON.stringify(oldMember.roles): {
      const addedRoles = client.ch.getDifference(member.roles, oldMember.roles);
      const removedRoles = client.ch.getDifference(oldMember.roles, member.roles);

      merge(
        addedRoles.map((r) => `<@&${r}>`).join(', '),
        removedRoles.map((r) => `<@&${r}>`).join(', '),
        'difference',
        language.roles,
      );

      break;
    }
    case member.toggles.has('deaf') !== oldMember.toggles.has('deaf'): {
      merge(member.toggles.has('deaf'), oldMember.toggles.has('deaf'), 'boolean', lan.deaf);
      break;
    }
    case member.toggles.has('mute') !== oldMember.toggles.has('mute'): {
      merge(member.toggles.has('mute'), oldMember.toggles.has('mute'), 'boolean', lan.deaf);
      break;
    }
    case member.toggles.has('pending') !== oldMember.toggles.has('pending'): {
      merge(member.toggles.has('pending'), oldMember.toggles.has('pending'), 'boolean', lan.deaf);
      break;
    }
    default: {
      return;
    }
  }

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
