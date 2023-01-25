import type * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';
import client from '../../BaseClient/Client.js';

export default async (oldUser: Discord.User, user: Discord.User, guild: Discord.Guild) => {
  const channels = await client.ch.getLogChannels('userevents', guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.userUpdate;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.name,
      url: client.customConstants.standard.userURL(user),
    },
    description: lan.desc(user),
    fields: [],
    color: client.customConstants.colors.loading,
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  if (user.avatar !== oldUser.avatar) {
    const attachment = (
      await client.ch.fileURL2Buffer([user.displayAvatarURL({ size: 4096 })])
    )?.[0]?.attachment;

    merge(
      user.displayAvatarURL({ size: 4096 }),
      client.ch.getNameAndFileType(user.displayAvatarURL({ size: 4096 })),
      'icon',
      lan.avatar,
    );

    if (attachment) {
      files.push({
        name: client.ch.getNameAndFileType(user.displayAvatarURL({ size: 4096 })),
        attachment,
      });
    }
  }
  if (user.flags !== oldUser.flags) {
    const flagsBefore = oldUser.flags?.toArray() ?? [];
    const flagsAfter = user.flags?.toArray() ?? [];
    const removed = client.ch.getDifference(flagsBefore, flagsAfter) as string[];
    const added = client.ch.getDifference(flagsAfter, flagsBefore) as string[];

    if (removed.length || added.length) {
      merge(
        added
          .map((r) =>
            flagsBefore.length
              ? `\`${language.userFlags[r as keyof typeof language.userFlags]}\``
              : language.unknown,
          )
          .join(', '),
        removed
          .map((r) =>
            flagsAfter.length
              ? `\`${language.userFlags[r as keyof typeof language.userFlags]}\``
              : language.unknown,
          )
          .join(', '),
        'difference',
        lan.flags,
      );
    }
  }
  if (user.discriminator !== oldUser.discriminator) {
    merge(
      oldUser.discriminator ?? language.unknown,
      user.discriminator,
      'string',
      lan.discriminator,
    );
  }
  if (user.username !== oldUser.username) {
    merge(oldUser.username ?? language.unknown, user.username, 'string', lan.username);
  }

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
