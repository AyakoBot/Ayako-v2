import Discord from 'discord.js';
import type DDeno from 'discordeno';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (msg: CT.MessageGuild, user?: DDeno.User) => {
  const channels = await client.ch.getLogChannels('messageevents', msg);
  if (!channels) return;

  const guild = await client.ch.cache.guilds.get(msg.guildId);
  if (!guild) return;

  const language = await client.ch.languageSelector(msg.guildId);
  const lan = language.events.logs.message;
  const con = client.customConstants.events.logs.message;
  const audit = await client.ch.getAudit(guild, 72, msg.id);
  const auditUser =
    user ?? (audit && audit.userId ? await client.ch.cache.users.get(audit.userId) : undefined);
  const files: DDeno.FileContent[] = [];
  const embeds: DDeno.Embed[] = [];

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.delete,
      name: lan.nameDelete,
    },
    description: auditUser ? lan.descDeleteAudit(auditUser, msg) : lan.descDelete(msg),
    fields: [],
    color: client.customConstants.colors.warning,
  };

  embeds.push(embed);

  const flagsText = [
    ...new Discord.MessageFlagsBitField(msg.flags).toArray().map((f) => lan.flags[f]),
    new Discord.PermissionsBitField(msg.bitfield).has(1n) ? lan.tts : null,
    new Discord.PermissionsBitField(msg.bitfield).has(2n) ? lan.mentionEveryone : null,
    new Discord.PermissionsBitField(msg.bitfield).has(4n) ? lan.pinned : null,
    msg.editedTimestamp ? lan.edited : null,
    msg.activity ? `${lan.activityName} ${lan.activity[msg.activity.type]}` : null,
    msg.interaction ? `${lan.interactionName} ${lan.interaction[msg.interaction.type]}` : null,
    msg.type ? lan.type[msg.type] : null,
    msg.isFromBot ? lan.isFromBot : null,
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

  if (msg.components?.length) {
    const components = client.ch.txtFileWriter(
      msg.components.map((c) => JSON.stringify(c, null, 2)),
      undefined,
      lan.components,
    );

    if (components) files.push(components);
  }

  if (msg.reactions?.length) {
    embed.fields?.push({
      name: lan.reactions,
      value: msg.reactions
        .map((r) => `${language.languageFunction.getEmote(r.emoji)} ${r.count}`)
        .join('\n'),
    });
  }

  if (msg.thread) {
    embed.fields?.push({
      name: language.channelTypes[msg.thread.type],
      value: language.languageFunction.getChannel(
        msg.thread as DDeno.Channel,
        language.channelTypes[msg.thread.type],
      ),
    });
  }

  if (msg.stickerItems?.length) {
    embed.fields?.push({
      name: lan.stickers,
      value: msg.stickerItems.map((s) => `\`${s.name}\` / \`${s.id}\``).join('\n'),
    });
  }

  if (msg.webhookId) {
    const webhook =
      (await client.ch.cache.webhooks.get(msg.webhookId, msg.channelId, msg.guildId)) ??
      (await client.helpers.getWebhook(msg.webhookId));

    embed.fields?.push({
      name: language.Webhook,
      value: language.languageFunction.getWebhook(webhook),
    });
  }

  if (msg.messageReference) {
    embed.fields?.push({
      name: lan.referenceMessage,
      value: language.languageFunction.getMessage(msg.messageReference as CT.MessageGuild),
    });
  }

  if (msg.embeds) {
    const msgEmbeds = client.ch.txtFileWriter(
      msg.embeds.map((c) => JSON.stringify(c, null, 2)),
      undefined,
      lan.embeds,
    );

    if (msgEmbeds) files.push(msgEmbeds);
  }

  if (msg.mentionedUserIds?.length) {
    embed.fields?.push({
      name: lan.mentionedUsers,
      value: msg.mentionedUserIds.map((m) => `<@${m}>`).join(', '),
    });
  }

  if (msg.mentionedRoleIds?.length) {
    embed.fields?.push({
      name: lan.mentionedRoles,
      value: msg.mentionedRoleIds.map((m) => `<@&${m}>`).join(', '),
    });
  }

  if (msg.mentionedChannelIds?.length) {
    embed.fields?.push({
      name: lan.mentionedChannels,
      value: msg.mentionedChannelIds.map((m) => `<#${m}>`).join(', '),
    });
  }

  if (msg.content) {
    const contentEmbed: DDeno.Embed = {
      description: msg.content,
      color: client.customConstants.colors.ephemeral,
      author: {
        name: language.content,
      },
    };

    embeds.push(contentEmbed);
  }

  if (msg.attachments?.length) {
    const attachments = (await client.ch.fileURL2Blob(msg.attachments.map((a) => a.url))).filter(
      (
        e,
      ): e is {
        blob: Blob;
        name: string;
      } => !!e,
    );

    if (attachments?.length) files.push(...attachments);
  }

  client.ch.send(
    { id: channels, guildId: msg.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    files.length ? undefined : 10000,
  );
};
