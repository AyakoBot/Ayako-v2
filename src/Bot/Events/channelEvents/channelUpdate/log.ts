import * as Discord from 'discord.js';
import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

type PermissionsBitField = { id: bigint; type: number; allow: bigint; deny: bigint };

export default async (channel: DDeno.Channel, oldChannel: DDeno.Channel) => {
  if (!channel.guildId) return;

  const channels = await client.ch.getLogChannels('channelevents', channel);
  if (!channels) return;

  const guild = await client.cache.guilds.get(channel.guildId);
  if (!guild) return;

  const language = await client.ch.languageSelector(channel.guildId);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.channel;
  const channelType = `${client.ch.getTrueChannelType(channel, guild)}Update`;
  let typeID = 11;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con[channelType as keyof typeof con],
      name: lan.nameUpdate,
    },
    fields: [],
    color: client.customConstants.colors.success,
  };

  const embeds = [embed];

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case oldChannel.flags !== channel.flags: {
      const [oldFlags, newFlags] = [oldChannel, channel].map((c) =>
        new Discord.ChannelFlagsBitField(c.flags).toArray(),
      );
      const removed = client.ch.getDifference(oldFlags, newFlags) as CT.ChannelFlags[];
      const added = client.ch.getDifference(newFlags, oldFlags) as CT.ChannelFlags[];

      merge(
        added.map((r) => lan.flags[r]).join(', '),
        removed.map((r) => lan.flags[r]).join(', '),
        'difference',
        language.Flags,
      );
      break;
    }
    case oldChannel.name !== channel.name: {
      merge(oldChannel.name, channel.name, 'string', language.name);
      break;
    }
    case oldChannel.topic !== channel.topic: {
      merge(oldChannel.topic, channel.topic, 'string', lan.topic);
      break;
    }
    case oldChannel.bitrate !== channel.bitrate: {
      merge(`${oldChannel.bitrate}kbps`, `${channel.bitrate}kbps`, 'string', lan.bitrate);
      break;
    }
    case oldChannel.nsfw !== channel.nsfw: {
      merge(oldChannel.nsfw, channel.nsfw, 'boolean', lan.nsfw);
      break;
    }
    case oldChannel.archived !== channel.archived: {
      merge(oldChannel.archived, channel.archived, 'boolean', lan.archived);
      break;
    }
    case oldChannel.locked !== channel.locked: {
      merge(oldChannel.locked, channel.locked, 'boolean', lan.locked);
      break;
    }
    case oldChannel.invitable !== channel.invitable: {
      merge(oldChannel.invitable, channel.invitable, 'boolean', lan.invitable);
      break;
    }
    case oldChannel.userLimit !== channel.userLimit: {
      merge(oldChannel.userLimit, channel.userLimit, 'string', lan.userLimit);
      break;
    }
    case oldChannel.rateLimitPerUser !== channel.rateLimitPerUser: {
      merge(
        client.ch.moment(oldChannel.rateLimitPerUser || 0, language),
        client.ch.moment(channel.rateLimitPerUser || 0, language),
        'string',
        lan.rateLimitPerUser,
      );
      break;
    }
    case oldChannel.rtcRegion !== channel.rtcRegion: {
      merge(
        oldChannel.rtcRegion
          ? language.regions[oldChannel.rtcRegion as keyof typeof language.regions]
          : language.unknown,
        channel.rtcRegion
          ? language.regions[channel.rtcRegion as keyof typeof language.regions]
          : language.unknown,
        'string',
        lan.rtcRegion,
      );
      break;
    }
    case oldChannel.videoQualityMode !== channel.videoQualityMode: {
      merge(
        oldChannel.videoQualityMode
          ? lan.videoQualityMode[oldChannel.videoQualityMode]
          : language.unknown,
        channel.videoQualityMode
          ? lan.videoQualityMode[channel.videoQualityMode]
          : language.unknown,
        'string',
        lan.videoQualityMode[0],
      );
      break;
    }
    case oldChannel.parentId !== channel.parentId: {
      const oldParent = oldChannel.parentId
        ? await client.cache.channels.get(oldChannel.parentId)
        : undefined;
      const parent = channel.parentId
        ? await client.cache.channels.get(channel.parentId)
        : undefined;

      merge(
        oldParent
          ? language.languageFunction.getChannel(oldParent, language.channelTypes[oldParent.type])
          : language.none,
        parent
          ? language.languageFunction.getChannel(parent, language.channelTypes[parent.type])
          : language.none,
        'string',
        lan.parentChannel,
      );
      break;
    }
    case oldChannel.archiveTimestamp !== channel.archiveTimestamp: {
      merge(
        oldChannel.archiveTimestamp
          ? `<t:${String(oldChannel.archiveTimestamp).slice(0, -3)}:f>`
          : language.none,
        channel.archiveTimestamp
          ? `<t:${String(channel.archiveTimestamp).slice(0, -3)}:f>`
          : language.none,
        'string',
        lan.archiveTimestamp,
      );
      break;
    }
    case oldChannel.autoArchiveDuration !== channel.autoArchiveDuration: {
      merge(
        client.ch.moment(oldChannel.autoArchiveDuration || 0, language),
        client.ch.moment(channel.autoArchiveDuration || 0, language),
        'string',
        lan.autoArchiveDuration,
      );
      break;
    }
    case oldChannel.type !== channel.type: {
      merge(
        language.channelTypes[oldChannel.type],
        language.channelTypes[channel.type],
        'string',
        lan.type,
      );
      break;
    }
    case JSON.stringify(oldChannel.permissionOverwrites) !==
      JSON.stringify(channel.permissionOverwrites): {
      const permEmbed: DDeno.Embed = {
        color: client.customConstants.colors.loading,
        fields: [],
      };
      embeds.push(permEmbed);

      const beforePerms = oldChannel.permissionOverwrites.map((p) =>
        client.ch.permissionCalculators.separateOverwrites(p),
      );
      const afterPerms = channel.permissionOverwrites.map((p) =>
        client.ch.permissionCalculators.separateOverwrites(p),
      );

      const tempOP: PermissionsBitField[] = [];
      const tempNP: PermissionsBitField[] = [];
      const newPerms: PermissionsBitField[] = [];
      const oldPerms: PermissionsBitField[] = [];

      beforePerms.forEach((o) =>
        tempOP.push({
          id: o[1],
          type: o[0],
          allow: o[2],
          deny: o[3],
        }),
      );
      afterPerms.forEach((o) =>
        tempNP.push({
          id: o[1],
          type: o[0],
          allow: o[2],
          deny: o[3],
        }),
      );

      tempNP.forEach((np) => {
        const op = tempOP.find((n) => n.id === np.id && n.type === np.type);
        if (op && (np.allow !== op.allow || np.deny !== op.deny)) newPerms.push(np);
      });
      tempOP.forEach((op) => {
        const np = tempNP.find((n) => n.id === op.id && n.type === op.type);
        if (np && (op.allow !== np.allow || op.deny !== np.deny)) oldPerms.push(op);
      });

      if (oldPerms.length < newPerms.length || oldPerms.length > newPerms.length) {
        const create = oldPerms.length < newPerms.length;
        let perm: PermissionsBitField = { id: 0n, type: 0, deny: 0n, allow: 0n };
        let text = '';
        typeID = create ? 13 : 15;

        if (newPerms[0] && !oldPerms[0]) [perm] = newPerms;
        else if (oldPerms[0] && !newPerms[0]) [perm] = oldPerms;
        else {
          newPerms.forEach((n) =>
            oldPerms.forEach((o) => {
              if (o !== n) perm = create ? n : o;
            }),
          );
        }

        if (perm.type === 1) text = `${language.Member} <@${perm.id}>`;
        else if (perm.type === 0) text = `${language.Role} <@&${perm.id}>`;
        else text = `${language.unknown} ${JSON.stringify(perm)}`;
        permEmbed.fields?.push({
          name: create ? lan.grantedPermissionFor : lan.removedPermissionsFor,
          value: text,
        });
      } else {
        for (
          let i = 0;
          newPerms.length > oldPerms.length ? newPerms.length : oldPerms.length > i;
          i += 1
        ) {
          const newPerm = newPerms[i];
          const oldPerm = oldPerms[i];
          const [tBit1, Bit1] = client.ch.bitUniques(oldPerm.deny, newPerm.deny);
          const [tBit2, Bit2] = client.ch.bitUniques(oldPerm.allow, newPerm.allow);
          const tBit3 = new Discord.PermissionsBitField(tBit1).add([
            ...new Discord.PermissionsBitField(tBit2),
          ]);
          const Bit3 = tBit3
            .remove([...new Discord.PermissionsBitField(Bit1)])
            .remove([...new Discord.PermissionsBitField(Bit2)]);

          let enable = '';
          let disable = '';
          let neutral = '';

          if (newPerm.type === 1) {
            disable = `<@${newPerm.id}>\n`;
            enable = `<@${newPerm.id}>\n`;
          } else if (newPerm.type === 0) {
            disable = `<@&${newPerm.id}>\n`;
            enable = `<@&${newPerm.id}>\n`;
          } else {
            disable = `${language.unknown} ${newPerm}\n`;
            enable = `${language.unknown} ${newPerm}\n`;
          }

          if (oldPerm.type === 1) {
            neutral = `<@${oldPerm.id}>\n`;
          } else if (oldPerm.type === 0) {
            neutral = `<@&${oldPerm.id}>\n`;
          } else {
            neutral = `${language.unknown} ${oldPerm}\n`;
          }

          const [useArray1, useArray2, useArray3] = [
            new Discord.PermissionsBitField(Bit1).toArray(),
            new Discord.PermissionsBitField(Bit2).toArray(),
            new Discord.PermissionsBitField(Bit3).toArray(),
          ].map((arr) => [...new Set(arr)]);

          new Array(useArray1.length).fill(null).forEach((_, j) => {
            disable += `${client.stringEmotes.switch.disable} \`${
              language.permissions.perms[useArray1[j]]
            }\`\n`;
          });

          new Array(useArray2.length).fill(null).forEach((_, j) => {
            enable += `${client.stringEmotes.switch.enable} \`${
              language.permissions.perms[useArray2[j]]
            }\`\n`;
          });

          new Array(useArray3.length).fill(null).forEach((_, j) => {
            neutral += `${client.stringEmotes.switch.neutral} \`${
              language.permissions.perms[useArray3[j]]
            }\`\n`;
          });

          if (neutral.includes('`')) {
            permEmbed.fields?.push({
              name: `${lan.removedPermissionsFor} ${
                oldPerm.type === 1 ? language.Member : language.Role
              }`,
              value: neutral,
            });
            typeID = 14;
          }

          if (disable.includes('`')) {
            permEmbed.fields?.push({
              name: `${lan.deniedPermissionsFor} ${
                newPerm.type === 1 ? language.Member : language.Role
              }`,
              value: disable,
            });
            typeID = 14;
          }

          if (enable.includes('`')) {
            permEmbed.fields?.push({
              name: `${lan.grantedPermissionFor} ${
                newPerm.type === 1 ? language.Member : language.Role
              }`,
              value: enable,
            });
            typeID = 14;
          }
        }
      }

      break;
    }
    default: {
      return;
    }
  }

  const audit = await client.ch.getAudit(guild, typeID, channel.id);
  const auditUser = await client.ch.getChannelOwner(channel, audit);
  embed.description = auditUser
    ? lan.descUpdateAudit(auditUser, channel, language.channelTypes[channel.type])
    : lan.descUpdate(channel, language.channelTypes[channel.type]);

  client.ch.send(
    { id: channels, guildId: channel.guildId },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
