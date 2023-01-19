import * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (guild: Discord.Guild, oldGuild: Discord.Guild) => {
  const channels = await client.ch.getLogChannels('guildevents', guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(guild, 1);
  const auditUser = audit?.executor ?? undefined;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.GuildUpdate,
      name: lan.guildUpdate,
    },
    description: auditUser ? lan.descGuildUpdateAudit(auditUser) : lan.descGuildUpdate(),
    fields: [],
    color: client.customConstants.colors.loading,
  };

  const oldWelcomeScreen = await client.ch.cache.welcomeScreens.get(guild.id);
  const newWelcomeScreen = await guild.fetchWelcomeScreen();
  if (newWelcomeScreen) client.ch.cache.welcomeScreens.set(newWelcomeScreen);

  const files: Discord.AttachmentPayload[] = [];
  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case guild.description !== oldGuild.description: {
      merge(oldGuild.description, guild.description, 'string', language.Description);
      break;
    }
    case guild.banner !== oldGuild.banner: {
      const url = guild.bannerURL({ size: 4096 });

      if (url) {
        const attachment = (await client.ch.fileURL2Buffer([url]))?.[0]?.attachment;

        merge(url, guild.banner, 'icon', lan.banner);

        if (attachment) {
          files.push({
            name: String(guild.banner),
            attachment,
          });
        }
      } else embed.fields?.push({ name: lan.banner, value: lan.bannerRemoved });

      break;
    }
    case guild.icon !== oldGuild.icon: {
      const url = guild.iconURL({ size: 4096 });

      if (url) {
        const attachment = (await client.ch.fileURL2Buffer([url]))?.[0]?.attachment;

        merge(url, guild.icon, 'icon', lan.icon);

        if (attachment) {
          files.push({
            name: String(guild.icon),
            attachment,
          });
        }
      } else embed.fields?.push({ name: lan.icon, value: lan.iconRemoved });

      break;
    }
    case guild.splash !== oldGuild.splash: {
      const url = guild.splashURL({ size: 4096 });

      if (url) {
        const attachment = (await client.ch.fileURL2Buffer([url]))?.[0]?.attachment;

        merge(url, guild.splash, 'icon', lan.splash);

        if (attachment) {
          files.push({
            name: String(guild.splash),
            attachment,
          });
        }
      } else embed.fields?.push({ name: lan.splash, value: lan.splashRemoved });

      break;
    }
    case guild.maximumMembers !== oldGuild.maximumMembers: {
      merge(oldGuild.maximumMembers, guild.maximumMembers, 'string', lan.maxMembers);
      break;
    }
    case guild.vanityURLCode !== oldGuild.vanityURLCode: {
      merge(oldGuild.vanityURLCode, guild.vanityURLCode, 'string', lan.vanityUrlCode);
      break;
    }
    case guild.discoverySplash !== oldGuild.discoverySplash: {
      const url = guild.discoverySplashURL({ size: 4096 });

      if (url) {
        const attachment = (await client.ch.fileURL2Buffer([url]))?.[0]?.attachment;

        merge(url, guild.discoverySplash, 'icon', lan.discoverySplash);

        if (attachment) {
          files.push({
            name: String(guild.discoverySplash),
            attachment,
          });
        }
      } else embed.fields?.push({ name: lan.discoverySplash, value: lan.discoverySplashRemoved });

      break;
    }
    case guild.afkChannelId !== oldGuild.afkChannelId: {
      merge(`<#${oldGuild.afkChannelId}>`, `<#${guild.afkChannelId}>`, 'string', lan.afkChannelId);
      break;
    }
    case guild.widgetChannelId !== oldGuild.widgetChannelId: {
      merge(
        oldGuild.widgetChannelId ? `<#${oldGuild.widgetChannelId}>` : language.none,
        guild.widgetChannelId ? `<#${guild.widgetChannelId}>` : language.none,
        'string',
        lan.widgetChannelId,
      );
      break;
    }
    case guild.systemChannelId !== oldGuild.systemChannelId: {
      merge(
        oldGuild.systemChannelId ? `<#${oldGuild.systemChannelId}>` : language.none,
        guild.systemChannelId ? `<#${guild.systemChannelId}>` : language.none,
        'string',
        lan.systemChannelId,
      );
      break;
    }
    case guild.rulesChannelId !== oldGuild.rulesChannelId: {
      merge(
        oldGuild.rulesChannelId ? `<#${oldGuild.rulesChannelId}>` : language.none,
        guild.rulesChannelId ? `<#${guild.rulesChannelId}>` : language.none,
        'string',
        lan.rulesChannelId,
      );
      break;
    }
    case guild.publicUpdatesChannelId !== oldGuild.publicUpdatesChannelId: {
      merge(
        oldGuild.publicUpdatesChannelId ? `<#${oldGuild.publicUpdatesChannelId}>` : language.none,
        guild.publicUpdatesChannelId ? `<#${guild.publicUpdatesChannelId}>` : language.none,
        'string',
        lan.publicUpdatesChannelId,
      );
      break;
    }
    case guild.name !== oldGuild.name: {
      merge(oldGuild.name, guild.name, 'string', lan.publicUpdatesChannelId);
      break;
    }
    case guild.ownerId !== oldGuild.ownerId: {
      merge(`<@${oldGuild.ownerId}>`, `<@${guild.ownerId}>`, 'string', lan.ownerId);
      break;
    }
    case guild.premiumProgressBarEnabled !== oldGuild.premiumProgressBarEnabled: {
      merge(
        oldGuild.premiumProgressBarEnabled,
        guild.premiumProgressBarEnabled,
        'boolean',
        lan.premiumProgressBarEnabled,
      );
      break;
    }
    case guild.afkTimeout !== oldGuild.afkTimeout: {
      merge(
        client.ch.moment(oldGuild.afkTimeout, language),
        client.ch.moment(guild.afkTimeout, language),
        'string',
        lan.afkTimeout,
      );
      break;
    }
    case guild.defaultMessageNotifications !== oldGuild.defaultMessageNotifications: {
      merge(
        lan.defaultMessageNotifications[oldGuild.defaultMessageNotifications],
        lan.defaultMessageNotifications[guild.defaultMessageNotifications],
        'string',
        lan.defaultMessageNotificationsName,
      );
      break;
    }
    case guild.explicitContentFilter !== oldGuild.explicitContentFilter: {
      merge(
        lan.explicitContentFilter[oldGuild.explicitContentFilter],
        lan.explicitContentFilter[guild.explicitContentFilter],
        'string',
        lan.explicitContentFilterName,
      );
      break;
    }
    case guild.mfaLevel !== oldGuild.mfaLevel: {
      merge(
        lan.mfaLevel[oldGuild.mfaLevel],
        lan.mfaLevel[guild.mfaLevel],
        'string',
        lan.mfaLevelName,
      );
      break;
    }
    case guild.nsfwLevel !== oldGuild.nsfwLevel: {
      merge(
        lan.nsfwLevel[oldGuild.nsfwLevel],
        lan.nsfwLevel[guild.nsfwLevel],
        'string',
        lan.nsfwLevelName,
      );
      break;
    }
    case guild.preferredLocale !== oldGuild.preferredLocale: {
      merge(
        language.regions[oldGuild.preferredLocale as keyof typeof language.regions],
        language.regions[guild.preferredLocale as keyof typeof language.regions],
        'string',
        lan.preferredLocale,
      );
      break;
    }
    case guild.premiumTier !== oldGuild.premiumTier: {
      merge(
        `${language.Tier} ${oldGuild.premiumTier}`,
        `${language.Tier} ${guild.premiumTier}`,
        'string',
        lan.premiumTier,
      );
      break;
    }
    case guild.verificationLevel !== oldGuild.verificationLevel: {
      merge(
        language.regions[oldGuild.preferredLocale as keyof typeof language.regions],
        language.regions[guild.preferredLocale as keyof typeof language.regions],
        'string',
        lan.preferredLocale,
      );
      break;
    }
    case newWelcomeScreen?.description !== oldWelcomeScreen?.description: {
      merge(
        oldWelcomeScreen?.description ?? language.none,
        newWelcomeScreen?.description ?? language.none,
        'string',
        lan.welcomeScreenDescription,
      );
      break;
    }
    case JSON.stringify(newWelcomeScreen?.welcomeChannels) !==
      JSON.stringify(oldWelcomeScreen?.welcomeChannels): {
      const addedChannel = client.ch.getDifference(
        newWelcomeScreen?.welcomeChannels.map((c) => c.channelId) ?? [],
        oldWelcomeScreen?.welcomeChannels.map((c) => c.channelId) ?? [],
      ) as {
        channelId: bigint;
        description: string;
        emojiId: bigint | undefined;
        emojiName: string | undefined;
      }[];

      const removedChannel = client.ch.getDifference(
        oldWelcomeScreen?.welcomeChannels.map((c) => c.channelId) ?? [],
        newWelcomeScreen?.welcomeChannels.map((c) => c.channelId) ?? [],
      ) as {
        channelId: bigint;
        description: string;
        emojiId: bigint | undefined;
        emojiName: string | undefined;
      }[];

      const changedChannel = client.ch.getChanged(
        (oldWelcomeScreen?.welcomeChannels.map((c) => c) ?? []) as unknown as {
          [key: string]: unknown;
        },
        (newWelcomeScreen?.welcomeChannels.map((c) => c) ?? []) as unknown as {
          [key: string]: unknown;
        },
        'channelId',
      ) as
        | {
            channelId: bigint;
            description: string;
            emojiId: bigint | undefined;
            emojiName: string | undefined;
          }[]
        | [];

      const emojis = await client.helpers.getEmojis(guild.id);
      emojis.forEach((e) => client.ch.cache.emojis.set(e, guild.id));

      if (addedChannel.length) {
        const addedChannels = await Promise.all(
          addedChannel.map((c) => client.ch.cache.channels.get(c.channelId, guild.id)),
        );

        addedChannel.forEach((c, i) => {
          const channel = addedChannels[i];
          if (!channel) return;

          const emoji = c.emojiId ? client.ch.cache.emojis.find(c.emojiId) : c.emojiName;

          embed.fields?.push({
            name: lan.welcomeChannelAdded,
            value: `${language.Channel}: ${language.languageFunction.getChannel(
              channel,
              language.channelTypes[channel.type],
            )}\n${language.Description}: \`${c.description}\`\n${language.Emoji}: ${
              (emoji && typeof emoji === 'object'
                ? language.languageFunction.getEmote(emoji)
                : emoji) ?? language.none
            }`,
          });
        });
      }

      if (removedChannel.length) {
        const removedChannels = await Promise.all(
          removedChannel.map((c) => client.ch.cache.channels.find(c.channelId)),
        );

        removedChannel.forEach((c, i) => {
          const channel = removedChannels[i];
          if (!channel) return;

          const emoji = c.emojiId ? client.ch.cache.emojis.find(c.emojiId) : c.emojiName;

          embed.fields?.push({
            name: lan.welcomeChannelRemoved,
            value: `${language.Channel}: ${language.languageFunction.getChannel(
              channel,
              language.channelTypes[channel.type],
            )}\n${language.Description}: \`${c.description}\`\n${language.Emoji}: ${
              (emoji && typeof emoji === 'object'
                ? language.languageFunction.getEmote(emoji)
                : emoji) ?? language.none
            }`,
          });
        });
      }

      if (changedChannel.length) {
        const changedChannels = await Promise.all(
          changedChannel.map((c) => client.ch.cache.channels.find(c.channelId)),
        );

        changedChannel.forEach((_, i) => {
          const channel = changedChannels[i];
          if (!channel) return;

          const oldChannel = oldWelcomeScreen?.welcomeChannels.find(
            (o) => o.channelId === channel.id,
          );
          const newChannel = newWelcomeScreen?.welcomeChannels.find(
            (o) => o.channelId === channel.id,
          );

          switch (true) {
            case oldChannel?.description !== newChannel?.description: {
              merge(
                oldChannel?.description,
                newChannel?.description,
                'string',
                language.Description,
              );
              break;
            }
            case `${oldChannel?.emojiId}-${oldChannel?.emojiName}` !==
              `${newChannel?.emojiId}-${newChannel?.emojiName}`: {
              const oldEmoji = oldChannel?.emojiId
                ? client.ch.cache.emojis.find(oldChannel.emojiId)
                : oldChannel?.emojiName;
              const newEmoji = newChannel?.emojiId
                ? client.ch.cache.emojis.find(newChannel.emojiId)
                : newChannel?.emojiName;

              merge(
                (oldEmoji && typeof oldEmoji === 'object'
                  ? language.languageFunction.getEmote(oldEmoji)
                  : oldEmoji) ?? language.none,
                (newEmoji && typeof newEmoji === 'object'
                  ? language.languageFunction.getEmote(newEmoji)
                  : newEmoji) ?? language.none,
                'string',
                lan.welcomeChannelEmoji(channel),
              );
              break;
            }
            default: {
              break;
            }
          }
        });
      }

      break;
    }
    case guild.toggles !== oldGuild.toggles: {
      const removedToggles = client.ch.getDifference(
        Object.entries(guild.toggles.list())
          .map((t) => (t[1] === true ? t[0] : undefined))
          .filter((t) => !!t),
        Object.entries(oldGuild.toggles.list())
          .map((t) => (t[1] === true ? t[0] : undefined))
          .filter((t) => !!t),
      ) as DDeno.GuildToggleKeys[];
      const addedToggles = client.ch.getDifference(
        Object.entries(oldGuild.toggles.list())
          .map((t) => (t[1] === true ? t[0] : undefined))
          .filter((t) => !!t),
        Object.entries(guild.toggles.list())
          .map((t) => (t[1] === true ? t[0] : undefined))
          .filter((t) => !!t),
      ) as DDeno.GuildToggleKeys[];

      if (removedToggles.length) {
        embed.fields?.push({
          name: lan.togglesNameRemoved,
          value: removedToggles.map((t) => lan.toggles[t]).join(', '),
        });
      }

      if (addedToggles.length) {
        embed.fields?.push({
          name: lan.togglesNameAdded,
          value: addedToggles.map((t) => lan.toggles[t]).join(', '),
        });
      }
      break;
    }
    case guild.systemChannelFlags !== oldGuild.systemChannelFlags: {
      const oldFlags = new Discord.SystemChannelFlagsBitField(
        oldGuild.systemChannelFlags,
      ).toArray();
      const newFlags = new Discord.SystemChannelFlagsBitField(guild.systemChannelFlags).toArray();

      const addedFlags = client.ch.getDifference(
        newFlags,
        oldFlags,
      ) as Discord.SystemChannelFlagsString[];
      const removedFlags = client.ch.getDifference(
        oldFlags,
        newFlags,
      ) as Discord.SystemChannelFlagsString[];

      if (addedFlags.length) {
        embed.fields?.push({
          name: lan.systemChannelFlagsNameRemoved,
          value: addedFlags
            .map((t) => lan.systemChannelFlags[t as keyof typeof lan.systemChannelFlags])
            .join(', '),
        });
      }

      if (removedFlags.length) {
        embed.fields?.push({
          name: lan.systemChannelFlagsNameAdded,
          value: removedFlags
            .map((t) => lan.systemChannelFlags[t as keyof typeof lan.systemChannelFlags])
            .join(', '),
        });
      }

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
