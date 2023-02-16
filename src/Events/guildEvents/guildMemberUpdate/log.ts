import type * as Discord from 'discord.js';
import { ch } from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
  const channels = await ch.getLogChannels('memberevents', member.guild);
  if (!channels) return;

  const language = await ch.languageSelector(member.guild.id);
  const lan = language.events.logs.guild;
  const con = ch.constants.events.logs.guild;
  const audit = member.user.bot ? await ch.getAudit(member.guild, 20, member.user.id) : undefined;
  const auditUser = audit?.executor ?? undefined;
  let description = '';

  if (member.user.bot) {
    if (audit && auditUser) description = lan.descBotUpdateAudit(member.user, auditUser);
    else description = lan.descBotUpdate(member.user);
  } else if (audit && auditUser) description = lan.descMemberUpdateAudit(member.user, auditUser);
  else description = lan.descMemberUpdate(member.user);

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: member.user.bot ? con.BotUpdate : con.MemberUpdate,
      name: member.user.bot ? lan.botUpdate : lan.memberUpdate,
    },
    description,
    fields: [],
    color: ch.constants.colors.loading,
  };

  const files: Discord.AttachmentPayload[] = [];
  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    ch.mergeLogging(before, after, type, embed, language, name);

  if (member.avatar !== oldMember.avatar) {
    const getImage = async () => {
      const url = member.displayAvatarURL({ size: 4096 });

      if (!url) {
        embed.fields?.push({
          name: lan.avatar,
          value: lan.avatarRemoved,
        });
        return;
      }

      const attachment = (await ch.fileURL2Buffer([url]))?.[0];

      merge(url, ch.getNameAndFileType(url), 'icon', lan.avatar);

      if (attachment) files.push(attachment);
    };

    await getImage();
  }
  if (member.nickname !== oldMember.nickname) {
    merge(oldMember.displayName, member.displayName, 'string', language.name);
  }
  if (member.premiumSinceTimestamp !== oldMember.premiumSinceTimestamp) {
    merge(
      oldMember.premiumSince
        ? ch.constants.standard.getTime(oldMember.premiumSince.getTime())
        : language.none,
      member.premiumSince
        ? ch.constants.standard.getTime(member.premiumSince.getTime())
        : language.none,

      'string',
      lan.premiumSince,
    );
  }
  if (
    member.communicationDisabledUntilTimestamp !== oldMember.communicationDisabledUntilTimestamp
  ) {
    merge(
      oldMember.communicationDisabledUntil
        ? ch.constants.standard.getTime(oldMember.communicationDisabledUntil.getTime())
        : language.none,
      member.communicationDisabledUntil
        ? ch.constants.standard.getTime(member.communicationDisabledUntil.getTime())
        : language.none,
      'string',
      lan.communicationDisabledUntil,
    );
  }
  if (
    JSON.stringify(member.roles.cache.map((r) => r.id)) !==
    JSON.stringify(oldMember.roles.cache.map((r) => r.id))
  ) {
    const addedRoles = ch.getDifference(
      member.roles.cache.map((r) => r),
      oldMember.roles.cache.map((r) => r),
    );
    const removedRoles = ch.getDifference(
      oldMember.roles.cache.map((r) => r),
      member.roles.cache.map((r) => r),
    );

    merge(
      addedRoles.length ? addedRoles.map((r) => `<@&${r.id}>`).join(', ') : undefined,
      removedRoles.length ? removedRoles.map((r) => `<@&${r.id}>`).join(', ') : undefined,
      'difference',
      language.roles,
    );
  }
  if (!!member.pending !== !!oldMember.pending) {
    merge(oldMember.pending, member.pending, 'boolean', lan.pending);
  }

  ch.send({ id: channels, guildId: member.guild.id }, { embeds: [embed], files }, undefined, 10000);
};
