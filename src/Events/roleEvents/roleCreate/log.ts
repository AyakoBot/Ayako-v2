import * as Discord from 'discord.js';
import { ch, client } from '../../../BaseClient/Client.js';

export default async (role: Discord.Role) => {
  const channels = await ch.getLogChannels('roleevents', role.guild);
  if (!channels) return;

  const language = await ch.languageSelector(role.guild.id);
  const lan = language.events.logs.role;
  const con = ch.constants.events.logs.role;
  const audit = role.tags?.botId ? undefined : await ch.getAudit(role.guild, 30, role.id);
  const auditUser =
    (role.tags?.botId ? await client.users.fetch(role.tags.botId) : audit?.executor) ?? undefined;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.create,
      name: lan.nameCreate,
    },
    description: auditUser ? lan.descCreateAudit(auditUser, role) : lan.descCreate(role),
    fields: [],
    color: ch.constants.colors.success,
  };

  if (role.icon) {
    const url = role.iconURL({ size: 4096 });
    if (url) {
      const attachments = (await ch.fileURL2Buffer([url]))?.[0];
      if (attachments) files.push(attachments);

      embed.thumbnail = {
        url: `attachment://${ch.getNameAndFileType(url)}`,
      };
    } else {
      embed.fields?.push({
        name: lan.icon,
        value: role.icon,
      });
    }
  }

  const flagsText = [
    role.managed ? lan.managed : null,
    role.hoist ? lan.hoisted : null,
    role.mentionable ? lan.mentionable : null,
    role.tags?.premiumSubscriberRole ? lan.boosterRole : null,
  ]
    .filter((f): f is string => !!f)
    .map((f) => `\`${f}\``)
    .join(', ');

  if (flagsText) {
    embed.fields?.push({
      name: language.Flags,
      value: flagsText,
      inline: true,
    });
  }

  if (role.unicodeEmoji) {
    embed.fields?.push({
      name: lan.unicodeEmoji,
      value: role.unicodeEmoji,
    });
  }

  if (role.name) {
    embed.fields?.push({
      name: language.name,
      value: role.name,
    });
  }

  if (role.color) {
    embed.fields?.push({
      name: language.color,
      value: role.color.toString(),
    });
  }

  const permEmbed: Discord.APIEmbed = {
    color: ch.constants.colors.ephemeral,
    description: Object.entries(new Discord.PermissionsBitField(role.permissions).serialize(false))
      .map(
        ([name, value]) =>
          `${value ? ch.stringEmotes.enabled : ch.stringEmotes.disabled} \`${
            language.permissions.perms[name as keyof typeof language.permissions.perms]
          }\``,
      )
      .join('\n'),
  };

  ch.send(
    { id: channels, guildId: role.guild.id },
    { embeds: [embed, permEmbed], files },
    undefined,
    10000,
  );
};
