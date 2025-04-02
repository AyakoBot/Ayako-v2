import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (guild: Discord.Guild, oldGuild: Discord.Guild) => {
 const channels = await guild.client.util.getLogChannels('guildevents', guild);
 if (!channels) return;

 const language = await guild.client.util.getLanguage(guild.id);
 const lan = language.events.logs.guild;
 const con = guild.client.util.constants.events.logs.guild;
 const audit = await guild.client.util.getAudit(guild, 1);
 const auditUser = audit?.executor ?? undefined;

 const embed: Discord.APIEmbed = {
  author: { icon_url: con.GuildUpdate, name: lan.guildUpdate },
  description: auditUser ? lan.descGuildUpdateAudit(auditUser) : lan.descGuildUpdate(),
  fields: [],
  color: CT.Colors.Loading,
  timestamp: new Date().toISOString(),
 };

 const oldWelcomeScreen = await guild.client.util.cache.welcomeScreens.get(guild);
 const newWelcomeScreen = await guild.client.util.request.guilds
  .getWelcomeScreen(guild)
  .then((w) => (!w || 'message' in w ? undefined : w));
 if (newWelcomeScreen) guild.client.util.cache.welcomeScreens.set(newWelcomeScreen);

 const files: Discord.AttachmentPayload[] = [];
 const merge = (after: unknown, before: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  guild.client.util.mergeLogging(before, after, type, embed, language, name);

 if (guild.description !== oldGuild.description) {
  merge(oldGuild.description, guild.description, 'string', language.t.Description);
 }
 if (guild.banner !== oldGuild.banner) {
  const getImage = async () => {
   const url = guild.bannerURL({ size: 4096 });

   if (!url) {
    embed.fields?.push({ name: lan.banner, value: lan.bannerRemoved });
    return;
   }

   const attachment = (await guild.client.util.fileURL2Buffer([url]))?.[0];

   merge(url, guild.client.util.getNameAndFileType(url), 'icon', lan.banner);

   if (attachment) files.push(attachment);
  };

  await getImage();
 }
 if (guild.icon !== oldGuild.icon) {
  const getImage = async () => {
   const url = guild.iconURL({ size: 4096 });

   if (!url) {
    embed.fields?.push({ name: lan.icon, value: lan.iconRemoved });
    return;
   }

   const attachment = (await guild.client.util.fileURL2Buffer([url]))?.[0];

   merge(url, guild.client.util.getNameAndFileType(url), 'icon', lan.icon);

   if (attachment) files.push(attachment);
  };

  await getImage();
 }
 if (guild.splash !== oldGuild.splash) {
  const getImage = async () => {
   const url = guild.splashURL({ size: 4096 });

   if (!url) {
    embed.fields?.push({ name: lan.splash, value: lan.splashRemoved });
    return;
   }

   const attachment = (await guild.client.util.fileURL2Buffer([url]))?.[0];

   merge(url, guild.client.util.getNameAndFileType(url), 'icon', lan.splash);

   if (attachment) files.push(attachment);
  };

  await getImage();
 }
 if (guild.maximumMembers !== oldGuild.maximumMembers) {
  merge(oldGuild.maximumMembers, guild.maximumMembers, 'string', lan.maxMembers);
 }
 if (guild.vanityURLCode !== oldGuild.vanityURLCode) {
  merge(oldGuild.vanityURLCode, guild.vanityURLCode, 'string', lan.vanityUrlCode);
 }
 if (guild.discoverySplash !== oldGuild.discoverySplash) {
  const getImage = async () => {
   const url = guild.discoverySplashURL({ size: 4096 });

   if (!url) {
    embed.fields?.push({ name: lan.discoverySplash, value: lan.discoverySplashRemoved });
    return;
   }

   const attachment = (await guild.client.util.fileURL2Buffer([url]))?.[0];

   merge(url, guild.client.util.getNameAndFileType(url), 'icon', lan.discoverySplash);

   if (attachment) files.push(attachment);
  };

  await getImage();
 }
 if (guild.afkChannelId !== oldGuild.afkChannelId) {
  merge(`<#${oldGuild.afkChannelId}>`, `<#${guild.afkChannelId}>`, 'string', lan.afkChannelId);
 }
 if (guild.systemChannelId !== oldGuild.systemChannelId) {
  merge(
   oldGuild.systemChannelId ? `<#${oldGuild.systemChannelId}>` : language.t.None,
   guild.systemChannelId ? `<#${guild.systemChannelId}>` : language.t.None,
   'string',
   lan.systemChannelId,
  );
 }
 if (guild.rulesChannelId !== oldGuild.rulesChannelId) {
  merge(
   oldGuild.rulesChannelId ? `<#${oldGuild.rulesChannelId}>` : language.t.None,
   guild.rulesChannelId ? `<#${guild.rulesChannelId}>` : language.t.None,
   'string',
   lan.rulesChannelId,
  );
 }
 if (guild.publicUpdatesChannelId !== oldGuild.publicUpdatesChannelId) {
  merge(
   oldGuild.publicUpdatesChannelId ? `<#${oldGuild.publicUpdatesChannelId}>` : language.t.None,
   guild.publicUpdatesChannelId ? `<#${guild.publicUpdatesChannelId}>` : language.t.None,
   'string',
   lan.publicUpdatesChannelId,
  );
 }
 if (guild.name !== oldGuild.name) {
  merge(oldGuild.name, guild.name, 'string', language.t.name);
 }
 if (guild.ownerId !== oldGuild.ownerId) {
  merge(`<@${oldGuild.ownerId}>`, `<@${guild.ownerId}>`, 'string', lan.ownerId);
 }
 if (guild.premiumProgressBarEnabled !== oldGuild.premiumProgressBarEnabled) {
  merge(
   oldGuild.premiumProgressBarEnabled,
   guild.premiumProgressBarEnabled,
   'boolean',
   lan.premiumProgressBarEnabled,
  );
 }
 if (guild.afkTimeout !== oldGuild.afkTimeout) {
  merge(
   guild.client.util.moment(oldGuild.afkTimeout, language),
   guild.client.util.moment(guild.afkTimeout, language),
   'string',
   lan.afkTimeout,
  );
 }
 if (guild.defaultMessageNotifications !== oldGuild.defaultMessageNotifications) {
  merge(
   lan.defaultMessageNotifications[oldGuild.defaultMessageNotifications],
   lan.defaultMessageNotifications[guild.defaultMessageNotifications],
   'string',
   lan.defaultMessageNotificationsName,
  );
 }
 if (guild.explicitContentFilter !== oldGuild.explicitContentFilter) {
  merge(
   lan.explicitContentFilter[oldGuild.explicitContentFilter],
   lan.explicitContentFilter[guild.explicitContentFilter],
   'string',
   lan.explicitContentFilterName,
  );
 }
 if (guild.mfaLevel !== oldGuild.mfaLevel) {
  merge(lan.mfaLevel[oldGuild.mfaLevel], lan.mfaLevel[guild.mfaLevel], 'string', lan.mfaLevelName);
 }
 if (guild.nsfwLevel !== oldGuild.nsfwLevel) {
  merge(
   lan.nsfwLevel[oldGuild.nsfwLevel],
   lan.nsfwLevel[guild.nsfwLevel],
   'string',
   lan.nsfwLevelName,
  );
 }
 if (guild.preferredLocale !== oldGuild.preferredLocale) {
  merge(
   language.regions[oldGuild.preferredLocale as keyof typeof language.regions],
   language.regions[guild.preferredLocale as keyof typeof language.regions],
   'string',
   lan.preferredLocale,
  );
 }
 if (guild.premiumTier !== oldGuild.premiumTier) {
  merge(
   `${language.t.Tier} ${oldGuild.premiumTier}`,
   `${language.t.Tier} ${guild.premiumTier}`,
   'string',
   lan.premiumTier,
  );
 }
 if (guild.verificationLevel !== oldGuild.verificationLevel) {
  merge(
   language.regions[oldGuild.preferredLocale as keyof typeof language.regions],
   language.regions[guild.preferredLocale as keyof typeof language.regions],
   'string',
   lan.preferredLocale,
  );
 }
 if (newWelcomeScreen?.description !== oldWelcomeScreen?.description) {
  merge(
   oldWelcomeScreen?.description ?? language.t.None,
   newWelcomeScreen?.description ?? language.t.None,
   'string',
   lan.welcomeScreenDescription,
  );
 }
 if (
  JSON.stringify(newWelcomeScreen?.welcomeChannels) !==
  JSON.stringify(oldWelcomeScreen?.welcomeChannels)
 ) {
  const addedChannel = guild.client.util.getDifference(
   newWelcomeScreen?.welcomeChannels.map((c) => c.channelId) ?? [],
   oldWelcomeScreen?.welcomeChannels.map((c) => c.channelId) ?? [],
  ) as {
   channelId: bigint;
   description: string;
   emojiId: bigint | undefined;
   emojiName: string | undefined;
  }[];

  const removedChannel = guild.client.util.getDifference(
   oldWelcomeScreen?.welcomeChannels.map((c) => c.channelId) ?? [],
   newWelcomeScreen?.welcomeChannels.map((c) => c.channelId) ?? [],
  ) as {
   channelId: bigint;
   description: string;
   emojiId: bigint | undefined;
   emojiName: string | undefined;
  }[];

  const changedChannel = guild.client.util.getChanged(
   (oldWelcomeScreen?.welcomeChannels.map((c) => c) ?? []) as unknown as Record<string, unknown>[],
   (newWelcomeScreen?.welcomeChannels.map((c) => c) ?? []) as unknown as Record<string, unknown>[],
   'channelId',
  ) as
   | {
      channelId: bigint;
      description: string;
      emojiId: bigint | undefined;
      emojiName: string | undefined;
     }[]
   | [];

  if (addedChannel.length) {
   addedChannel.forEach((c) => {
    const channel = guild.channels.cache.get(String(c.channelId));
    if (!channel) return;

    const emoji = c.emojiId ? guild.emojis.cache.get(String(c.emojiId)) : c.emojiName;

    embed.fields?.push({
     name: lan.welcomeChannelAdded,
     value: `${language.t.Channel}: ${language.languageFunction.getChannel(
      channel,
      language.channelTypes[channel.type],
     )}\n${language.t.Description}: \`${c.description}\`\n${language.t.Emoji}: ${
      (emoji && typeof emoji === 'object' ? language.languageFunction.getEmote(emoji) : emoji) ??
      language.t.None
     }`,
    });
   });
  }

  if (removedChannel.length) {
   removedChannel.forEach((c) => {
    const channel = guild.channels.cache.get(String(c.channelId));
    if (!channel) return;

    const emoji = c.emojiId ? guild.emojis.cache.get(String(c.emojiId)) : c.emojiName;

    embed.fields?.push({
     name: lan.welcomeChannelRemoved,
     value: `${language.t.Channel}: ${language.languageFunction.getChannel(
      channel,
      language.channelTypes[channel.type],
     )}\n${language.t.Description}: \`${c.description}\`\n${language.t.Emoji}: ${
      (emoji && typeof emoji === 'object' ? language.languageFunction.getEmote(emoji) : emoji) ??
      language.t.None
     }`,
    });
   });
  }

  if (changedChannel.length) {
   changedChannel.forEach((c) => {
    const channel = guild.channels.cache.get(String(c.channelId));
    if (!channel) return;

    const oldChannel = oldWelcomeScreen?.welcomeChannels.find((o) => o.channelId === channel.id);
    const newChannel = newWelcomeScreen?.welcomeChannels.find((o) => o.channelId === channel.id);

    if (oldChannel?.description !== newChannel?.description) {
     merge(oldChannel?.description, newChannel?.description, 'string', language.t.Description);
    }
    if (
     `${oldChannel?.emoji.id}-${oldChannel?.emoji.name}` !==
     `${newChannel?.emoji.id}-${newChannel?.emoji.name}`
    ) {
     const oldEmoji = oldChannel?.emoji.id
      ? guild.emojis.cache.get(oldChannel.emoji.id)
      : oldChannel?.emoji.name;
     const newEmoji = newChannel?.emoji.id
      ? guild.emojis.cache.get(newChannel.emoji.id)
      : newChannel?.emoji.name;

     merge(
      (oldEmoji && typeof oldEmoji === 'object'
       ? language.languageFunction.getEmote(oldEmoji)
       : oldEmoji) ?? language.t.None,
      (newEmoji && typeof newEmoji === 'object'
       ? language.languageFunction.getEmote(newEmoji)
       : newEmoji) ?? language.t.None,
      'string',
      lan.welcomeChannelEmoji(channel as Discord.GuildChannel),
     );
    }
   });
  }
 }

 if (guild.features !== oldGuild.features) {
  const removedToggles = guild.client.util.getDifference(guild.features, oldGuild.features);
  const addedToggles = guild.client.util.getDifference(oldGuild.features, guild.features);

  if (removedToggles.length) {
   embed.fields?.push({
    name: lan.togglesNameRemoved,
    value: removedToggles
     .map(
      (t) =>
       language.features[
        t as unknown as (typeof Discord.GuildFeature)[keyof typeof Discord.GuildFeature]
       ],
     )
     .join(', '),
   });
  }

  if (addedToggles.length) {
   embed.fields?.push({
    name: lan.togglesNameAdded,
    value: addedToggles
     .map((t) => language.features[t as unknown as Discord.GuildFeature])
     .join(', '),
   });
  }
 }
 if (guild.systemChannelFlags !== oldGuild.systemChannelFlags) {
  const oldFlags = new Discord.SystemChannelFlagsBitField(oldGuild.systemChannelFlags).toArray();
  const newFlags = new Discord.SystemChannelFlagsBitField(guild.systemChannelFlags).toArray();

  const addedFlags = guild.client.util.getDifference(newFlags, oldFlags);
  const removedFlags = guild.client.util.getDifference(oldFlags, newFlags);

  if (addedFlags.length) {
   embed.fields?.push({
    name: lan.systemChannelFlagsNameRemoved,
    value: addedFlags
     .map((t) => lan.systemChannelFlags[t as unknown as Discord.ChannelFlagsString])
     .join(', '),
   });
  }

  if (removedFlags.length) {
   embed.fields?.push({
    name: lan.systemChannelFlagsNameAdded,
    value: removedFlags
     .map((t) => lan.systemChannelFlags[t as unknown as Discord.SystemChannelFlagsString])
     .join(', '),
   });
  }
 }

 if (!embed.fields?.length) return;

 guild.client.util.send({ id: channels, guildId: guild.id }, { embeds: [embed], files }, 10000);
};
