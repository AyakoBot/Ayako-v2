import type * as DDeno from 'discordeno';
import * as Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';
import client from '../../BaseClient/DDenoClient.js';

export default async (user: DDeno.User, oldUser: DDeno.User, guilds: DDeno.Guild[]) => {
  guilds.forEach(async (g) => {
    const channels = await client.ch.getLogChannels('userevents', { guildId: g.id });
    if (!channels) return;

    const language = await client.ch.languageSelector(g.id);
    const lan = language.events.logs.userUpdate;

    const embed: DDeno.Embed = {
      author: {
        name: lan.name,
        url: client.customConstants.standard.appURL(user),
      },
      description: lan.desc(user),
      fields: [],
      color: client.customConstants.colors.loading,
    };

    const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
      client.ch.mergeLogging(before, after, type, embed, language, name);

    const files: DDeno.FileContent[] = [];

    switch (true) {
      case user.avatar !== oldUser.avatar: {
        const url = client.ch.getAvatarURL(user);
        const blob = (await client.ch.fileURL2Buffer([url]))?.[0]?.blob;

        merge(url, user.avatar, 'icon', lan.avatar);

        if (blob) {
          files.push({
            name: String(user.avatar),
            blob,
          });
        }
        break;
      }
      case user.flags !== oldUser.flags:
      case user.publicFlags !== oldUser.publicFlags: {
        const before = user.flags !== oldUser.flags ? oldUser.flags : oldUser.publicFlags;
        const after = user.flags !== oldUser.flags ? user.flags : user.publicFlags;
        const flagsBefore = new Discord.UserFlagsBitField(before).toArray();
        const flagsAfter = new Discord.UserFlagsBitField(after).toArray();
        const removed = client.ch.getDifference(flagsBefore, flagsAfter) as string[];
        const added = client.ch.getDifference(flagsAfter, flagsBefore) as string[];

        merge(
          added
            .map((r) => `\`${language.userFlags[r as keyof typeof language.userFlags]}\``)
            .join(', '),
          removed
            .map((r) => `\`${language.userFlags[r as keyof typeof language.userFlags]}\``)
            .join(', '),
          'difference',
          lan.flags,
        );
        break;
      }
      case user.premiumType !== oldUser.premiumType: {
        merge(
          oldUser.premiumType ? lan.PremiumTypes[oldUser.premiumType] : language.none,
          user.premiumType ? lan.PremiumTypes[user.premiumType] : language.none,
          'string',
          lan.PremiumTypes.name,
        );
        break;
      }
      case user.discriminator !== oldUser.discriminator: {
        merge(oldUser.discriminator, user.discriminator, 'string', lan.discriminator);
        break;
      }
      case user.username !== oldUser.username: {
        merge(oldUser.username, user.username, 'string', lan.username);
        break;
      }
      default: {
        return;
      }
    }

    client.ch.send(
      { id: channels, guildId: g.id },
      { embeds: [embed], files },
      language,
      undefined,
      10000,
    );
  });
};
