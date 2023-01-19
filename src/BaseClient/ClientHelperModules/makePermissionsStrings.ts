import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';
import client from '../Client.js';

export default (
  p: Discord.PermissionOverwrites,
  oldChannel: Discord.GuildChannel | undefined,
  channel: Discord.GuildChannel,
  language: CT.Language,
) => {
  const before = oldChannel?.permissionOverwrites.cache.get(p.id);
  const after = channel.permissionOverwrites.cache.get(p.id);
  const beforeDenied = Object.entries(before?.deny.serialize() ?? {});
  const afterDenied = Object.entries(after?.deny.serialize() ?? {});
  const beforeAllow = Object.entries(before?.allow.serialize() ?? {});
  const afterAllow = Object.entries(after?.allow.serialize() ?? {});
  const changedDenied = beforeDenied
    .filter(
      ([beforeKey, beforeBool]) =>
        afterDenied.find(([afterKey]) => beforeKey === afterKey)?.[1] !== beforeBool,
    )
    .map(
      ([k]) =>
        `${client.stringEmotes.switch.disable} ${
          language.permissions.perms[k as keyof typeof language.permissions.perms]
        }`,
    );
  const changedAllow = beforeAllow
    .filter(
      ([beforeKey, beforeBool]) =>
        afterAllow.find(([afterKey]) => beforeKey === afterKey)?.[1] !== beforeBool,
    )
    .map(
      ([k]) =>
        `${client.stringEmotes.switch.enable} ${
          language.permissions.perms[k as keyof typeof language.permissions.perms]
        }`,
    );
  const changedNeutral = [...changedDenied, ...changedAllow]
    .filter(([key]) => {
      const beforeDenyPerm = beforeDenied.find(([k]) => k === key);
      const afterDenyPerm = afterDenied.find(([k]) => k === key);
      const beforeAllowPerm = beforeAllow.find(([k]) => k === key);
      const afterAllowPerm = afterAllow.find(([k]) => k === key);

      if (
        (beforeDenyPerm?.[0] === beforeAllowPerm?.[0] ||
          afterDenyPerm?.[0] === afterAllowPerm?.[0]) &&
        (afterDenyPerm?.[0] !== beforeDenyPerm?.[0] || afterAllowPerm?.[0] !== beforeAllowPerm?.[0])
      ) {
        return true;
      }
      return false;
    })
    .map(
      ([k]) =>
        `${client.stringEmotes.switch.neutral} ${
          language.permissions.perms[k as keyof typeof language.permissions.perms]
        }`,
    );

  return [...changedDenied, ...changedAllow, ...changedNeutral];
};
