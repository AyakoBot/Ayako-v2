import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

/**
 * Returns the preview of a guild.
 * @param guild - The guild to get the preview for.
 * @returns A promise that resolves with the guild preview.
 */
const getPreview = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getPreview(guild.id)
  .then((p) => new Classes.GuildPreview(guild.client, p))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates a new guild.
 * @param guild The guild to create the new guild in.
 * @param body The JSON body of the request.
 * @returns A promise that resolves with the newly created guild or rejects with a DiscordAPIError.
 */
const create = (guild: Discord.Guild, body: Discord.RESTPostAPIGuildsJSONBody) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .create(body)
  .then((g) => new Classes.Guild(guild.client, g))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a guild.
 * @param guild The guild to edit.
 * @param body The data to edit the guild with.
 * @returns A promise that resolves with the edited guild.
 */
const edit = async (guild: Discord.Guild, body: Discord.RESTPatchAPIGuildJSONBody) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .edit(guild.id, {
   ...body,
   icon: body.icon ? await Discord.DataResolver.resolveImage(body.icon) : body.icon,
   splash: body.splash ? await Discord.DataResolver.resolveImage(body.splash) : body.splash,
   banner: body.banner ? await Discord.DataResolver.resolveImage(body.banner) : body.banner,
   discovery_splash: body.discovery_splash
    ? await Discord.DataResolver.resolveImage(body.discovery_splash)
    : body.discovery_splash,
  })
  .then((g) => new Classes.Guild(guild.client, g))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes the specified guild.
 * @param guild The guild to delete.
 * @returns A promise that resolves with the deleted guild ID if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const del = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds.delete(guild.id).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Retrieves members from a guild.
 * @param guild - The guild to retrieve members from.
 * @param query - The query parameters for the API request.
 * @returns A promise that resolves with an array of GuildMember objects.
 */
const getMembers = (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildMembersQuery) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getMembers(guild.id, query)
  .then((members) => {
   const parsed = members.map((m) => new Classes.GuildMember(guild.client, m, guild));
   parsed.forEach((p) => {
    if (guild.members.cache.get(p.id)) return;
    guild.members.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves all channels in a guild and returns them as an array of parsed Channel objects.
 * If the channels are already cached, they are not added again.
 * @param guild - The guild to retrieve channels from.
 * @returns A Promise that resolves with an array of parsed Channel objects.
 */
const getChannels = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getChannels(guild.id)
  .then((channels) => {
   const parsed = channels.map((c) => Classes.Channel(guild.client, c, guild));
   parsed.forEach((p) => {
    if (guild.channels.cache.get(p.id)) return;
    guild.channels.cache.set(p.id, p as Discord.GuildBasedChannel);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates a new channel in the specified guild.
 * @param guild The guild where the channel will be created.
 * @param body The channel data to be sent to the API.
 * @param reason The reason for creating the channel.
 * @returns A promise that resolves with the created channel or rejects with a DiscordAPIError.
 */
const createChannel = (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildChannelJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .createChannel(guild.id, body, { reason })
  .then((c) => Classes.Channel(guild.client, c, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Sets the positions of a batch of channels for a guild.
 * @param guild - The guild to set the channel positions for.
 * @param body - The JSON body containing the new positions of the channels.
 * @param reason - The reason for setting the channel positions (optional).
 * @returns A promise that resolves with the updated guild channel positions,
 * or rejects with a DiscordAPIError.
 */
const setChannelPositions = (
 guild: Discord.Guild,
 body: Discord.RESTPatchAPIGuildChannelPositionsJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .setChannelPositions(guild.id, body, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves active threads for a given guild.
 * @param guild - The guild to retrieve active threads for.
 * @returns A promise that resolves with an array of parsed thread channels.
 */
const getActiveThreads = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getActiveThreads(guild.id)
  .then((threads) => {
   const parsed = threads.threads.map((t) => Classes.Channel<10>(guild.client, t, guild));
   parsed.forEach((p) => {
    if (p.parent?.threads.cache.get(p.id)) return;
    p.parent?.threads.cache.set(
     p.id,
     p as Discord.ThreadChannel<true> & Discord.ThreadChannel<false>,
    );
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the ban for a given user in a guild.
 * @param guild - The guild to retrieve the ban from.
 * @param userId - The ID of the user to retrieve the ban for.
 * @returns A promise that resolves with the GuildBan object for the user,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const getMemberBan = async (guild: Discord.Guild, userId: string) =>
 guild.bans.cache.get(userId) ??
 (cache.apis.get(guild.id) ?? API).guilds
  .getMemberBan(guild.id, userId)
  .then((b) => {
   const parsed = new Classes.GuildBan(guild.client, b, guild);
   if (guild.bans.cache.get(parsed.user.id)) return parsed;
   guild.bans.cache.set(parsed.user.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Bans a user from a guild.
 * @param guild The guild to ban the user from.
 * @param userId The ID of the user to ban.
 * @param body Optional request body to send.
 * @param reason Reason for banning the user.
 * @returns A promise that resolves with the DiscordAPIError if the request fails, otherwise void.
 */
const banUser = (
 guild: Discord.Guild,
 userId: string,
 body?: Discord.RESTPutAPIGuildBanJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds.banUser(guild.id, userId, body, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Unbans a user from the specified guild.
 * @param guild - The guild to unban the user from.
 * @param userId - The ID of the user to unban.
 * @param reason - The reason for unbanning the user (optional).
 * @returns A promise that resolves with the DiscordAPIError if an error occurs, otherwise void.
 */
const unbanUser = (guild: Discord.Guild, userId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds.unbanUser(guild.id, userId, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Retrieves the roles of a guild from the Discord API
 * and parses them into an array of Role objects.
 * @param guild - The guild to retrieve the roles from.
 * @returns A Promise that resolves with an array of Role objects.
 */
const getRoles = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getRoles(guild.id)
  .then((roles) => {
   const parsed = roles.map((r) => new Classes.Role(guild.client, r, guild));
   parsed.forEach((p) => {
    if (guild.roles.cache.get(p.id)) return;
    guild.roles.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates a new role in the specified guild.
 * @param guild - The guild where the role will be created.
 * @param body - The role data to be sent in the request body.
 * @param reason - The reason for creating the role.
 * @returns A promise that resolves with the created role or rejects with a DiscordAPIError.
 */
const createRole = async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildRoleJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .createRole(
   guild.id,
   { ...body, icon: body.icon ? await Discord.DataResolver.resolveImage(body.icon) : body.icon },
   { reason },
  )
  .then((r) => new Classes.Role(guild.client, r, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Sets the positions of a guild's roles.
 * @param guild The guild to set the role positions for.
 * @param body The JSON body containing the new role positions.
 * @param reason The reason for setting the role positions (optional).
 * @returns A promise that resolves with an array of Role objects representing the updated roles,
 * or rejects with a DiscordAPIError.
 */
const setRolePositions = (
 guild: Discord.Guild,
 body: Discord.RESTPatchAPIGuildRolePositionsJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .setRolePositions(guild.id, body, { reason })
  .then((roles) => roles.map((r) => new Classes.Role(guild.client, r, guild)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a role in a guild.
 * @param guild The guild where the role is located.
 * @param roleId The ID of the role to edit.
 * @param body The new data for the role.
 * @param reason The reason for editing the role.
 * @returns A promise that resolves with the edited role or rejects with a DiscordAPIError.
 */
const editRole = async (
 guild: Discord.Guild,
 roleId: string,
 body: Discord.RESTPatchAPIGuildRoleJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editRole(
   guild.id,
   roleId,
   { ...body, icon: body.icon ? await Discord.DataResolver.resolveImage(body.icon) : body.icon },
   { reason },
  )
  .then((r) => new Classes.Role(guild.client, r, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes a role from a guild.
 * @param guild - The guild where the role will be deleted.
 * @param roleId - The ID of the role to be deleted.
 * @param reason - The reason for deleting the role.
 * @returns A promise that resolves with the deleted role,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const deleteRole = (guild: Discord.Guild, roleId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds.deleteRole(guild.id, roleId, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Edits the MFA level of a guild.
 * @param guild The guild to edit the MFA level of.
 * @param level The new MFA level to set.
 * @param reason The reason for editing the MFA level.
 * @returns A promise that resolves with the edited guild if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const editMFALevel = (guild: Discord.Guild, level: Discord.GuildMFALevel, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds.editMFALevel(guild.id, level, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Get the number of members that would be removed in a prune operation.
 * @param guild - The guild to get the prune count for.
 * @param query - The query parameters for the prune operation.
 * @returns A promise that resolves with the number of members that
 * would be removed in the prune operation.
 */
const getPruneCount = (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildPruneCountQuery) =>
 (cache.apis.get(guild.id) ?? API).guilds.getPruneCount(guild.id, query).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Begins pruning of inactive members in a guild.
 * @param guild - The guild to prune members from.
 * @param body - The JSON body to send with the prune request.
 * @param reason - The reason for beginning the prune.
 * @returns A promise that resolves with the result of the prune request,
 * or rejects with a DiscordAPIError.
 */
const beginPrune = (
 guild: Discord.Guild,
 body?: Discord.RESTPostAPIGuildPruneJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds.beginPrune(guild.id, body, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Retrieves the voice regions for a given guild.
 * @param guild - The guild to retrieve the voice regions for.
 * @returns A promise that resolves with an array of voice regions for the guild.
 */
const getVoiceRegions = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getVoiceRegions(guild.id)
  .then((voiceRegions) => voiceRegions.map((vR) => new Classes.VoiceRegion(vR)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the invites for a given guild.
 * @param guild The guild to retrieve invites for.
 * @returns A promise that resolves with an array of parsed invite objects.
 */
const getInvites = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getInvites(guild.id)
  .then((invites) => {
   const parsed = invites.map((i) => new Classes.Invite(guild.client, i));
   parsed.forEach((p) => {
    if (guild.invites.cache.get(p.code)) return;
    guild.invites.cache.set(p.code, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Returns a promise that resolves with an array of integrations for the given guild.
 * If an error occurs, logs the error and returns the error object.
 * @param guild - The guild to get integrations for.
 * @returns A promise that resolves with an array of integrations for the given guild.
 */
const getIntegrations = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getIntegrations(guild.id)
  .then((integrations) => integrations.map((i) => new Classes.Integration(guild.client, i, guild)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes an integration from a guild.
 * @param guild The guild to delete the integration from.
 * @param integrationId The ID of the integration to delete.
 * @param reason The reason for deleting the integration.
 * @returns A promise that resolves with the deleted integration if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const deleteIntegration = (guild: Discord.Guild, integrationId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .deleteIntegration(guild.id, integrationId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the widget settings for a given guild.
 * @param guild - The guild to retrieve the widget settings for.
 * @returns A promise that resolves to an object containing the widget
 * settings (enabled and channelId).
 */
const getWidgetSettings = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getWidgetSettings(guild.id)
  .then((w) => ({ enabled: w.enabled, channelId: w.channel_id }))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits the widget settings for a guild.
 * @param guild The guild to edit the widget settings for.
 * @param body The new widget settings to apply.
 * @param reason The reason for editing the widget settings.
 * @returns A promise that resolves to an object containing the new widget settings.
 */
const editWidgetSettings = (
 guild: Discord.Guild,
 body: Discord.RESTPatchAPIGuildWidgetSettingsJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editWidgetSettings(guild.id, body, { reason })
  .then((w) => ({ enabled: w.enabled, channelId: w.channel_id }))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the widget for a given guild.
 * @param guild - The guild to retrieve the widget for.
 * @returns A promise that resolves with a new Widget instance if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
const getWidget = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getWidget(guild.id)
  .then((w) => new Classes.Widget(guild.client, w))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the vanity URL for a given guild and returns an invite object with the parsed data.
 * @param guild The guild to retrieve the vanity URL for.
 * @returns A Promise that resolves with the parsed invite object,
 * or rejects with a DiscordAPIError if the vanity URL is missing or inaccessible.
 */
const getVanityURL = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getVanityURL(guild.id)
  .then(async (v) => {
   const parsed = v.code
    ? new Classes.Invite(guild.client, {
       code: v.code,
       guild: {
        id: guild.id,
        name: guild.name,
        splash: guild.splash,
        banner: guild.banner,
        icon: guild.icon,
        vanity_url_code: v.code,
        description: guild.description,
        features: guild.features as Discord.APIGuild['features'],
        verification_level: guild.verificationLevel,
        nsfw_level: guild.nsfwLevel,
        premium_subscription_count: guild.premiumSubscriptionCount ?? undefined,
       },
       channel: guild.rulesChannel
        ? {
           id: guild.rulesChannel.id,
           name: guild.rulesChannel.name,
           type: guild.rulesChannel.type,
          }
        : null,
       inviter: await (cache.apis.get(guild.id) ?? API).users
        .get(guild.ownerId)
        .catch(() => undefined),
       approximate_presence_count: guild.approximatePresenceCount ?? undefined,
       approximate_member_count: guild.approximateMemberCount ?? undefined,
       uses: v.uses,
       max_uses: 0,
       max_age: 0,
       temporary: false,
       created_at: guild.createdAt.toISOString(),
      })
    : undefined;
   if (parsed) guild.invites.cache.set(parsed.code, parsed);
   return parsed;
  })
  .catch((e) => {
   if (e.message !== 'Missing Access') {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }
   return e as Discord.DiscordAPIError;
  });

/**
 * Get the widget image of a guild with the specified style.
 * @param guild - The guild to get the widget image for.
 * @param style - The style of the widget image.
 * @returns A Promise that resolves with the widget image, or rejects with a DiscordAPIError.
 */
const getWidgetImage = (guild: Discord.Guild, style?: Discord.GuildWidgetStyle) =>
 (cache.apis.get(guild.id) ?? API).guilds.getWidgetImage(guild.id, style).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Retrieves the welcome screen for a guild.
 * @param guild - The guild to retrieve the welcome screen for.
 * @returns A Promise that resolves with a new WelcomeScreen instance if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
const getWelcomeScreen = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getWelcomeScreen(guild.id)
  .then((w) => new Classes.WelcomeScreen(guild, w))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits the welcome screen of a guild.
 * @param guild - The guild to edit the welcome screen for.
 * @param body - The new welcome screen data.
 * @param reason - The reason for editing the welcome screen.
 * @returns A promise that resolves with the updated welcome screen,
 * or rejects with a DiscordAPIError.
 */
const editWelcomeScreen = (
 guild: Discord.Guild,
 body: Discord.RESTPatchAPIGuildWelcomeScreenJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editWelcomeScreen(guild.id, body, { reason })
  .then((w) => new Classes.WelcomeScreen(guild, w))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits the voice state of a user in a guild.
 * @param guild The guild where the user's voice state will be edited.
 * @param userId The ID of the user whose voice state will be edited.
 * @param body The new voice state data for the user.
 * @param reason The reason for editing the user's voice state.
 * @returns A promise that resolves with the updated voice state of the user,
 * or rejects with a DiscordAPIError.
 */
const editUserVoiceState = (
 guild: Discord.Guild,
 userId: string,
 body: Discord.RESTPatchAPIGuildVoiceStateUserJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editUserVoiceState(guild.id, userId, body, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Fetches the emojis of a guild and adds them to the guild's cache.
 * If the guild's emojis are already in the cache, it returns them from the cache.
 * @param guild - The guild to fetch the emojis for.
 * @returns A promise that resolves with an array of GuildEmoji objects.
 */
const getEmojis = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getEmojis(guild.id)
  .then((emojis) => {
   const parsed = emojis.map((e) => new Classes.GuildEmoji(guild.client, e, guild));
   parsed.forEach((p) => {
    if (guild.emojis.cache.get(p.id)) return;
    guild.emojis.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves an emoji from the given guild by its ID.
 * @param guild - The guild to retrieve the emoji from.
 * @param emojiId - The ID of the emoji to retrieve.
 * @returns A Promise that resolves with the retrieved emoji, or rejects with an error.
 */
const getEmoji = async (guild: Discord.Guild, emojiId: string) =>
 guild.emojis.cache.get(emojiId) ??
 (cache.apis.get(guild.id) ?? API).guilds
  .getEmoji(guild.id, emojiId)
  .then((e) => {
   const parsed = new Classes.GuildEmoji(guild.client, e, guild);
   if (guild.emojis.cache.get(parsed.id)) return parsed;
   guild.emojis.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates a new emoji for the specified guild.
 * @param guild The guild to create the emoji in.
 * @param body The emoji data to create.
 * @param reason The reason for creating the emoji.
 * @returns A promise that resolves with the created GuildEmoji object,
 *  or rejects with a DiscordAPIError.
 */
const createEmoji = async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildEmojiJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .createEmoji(
   guild.id,
   {
    ...body,
    image: (await Discord.DataResolver.resolveImage(body.image)) as string,
   },
   { reason },
  )
  .then((e) => new Classes.GuildEmoji(guild.client, e, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a guild emoji.
 * @param guild The guild where the emoji is located.
 * @param emojiId The ID of the emoji to edit.
 * @param body The new data for the emoji.
 * @param reason The reason for editing the emoji.
 * @returns A promise that resolves with the edited guild emoji, or rejects with a DiscordAPIError.
 */
const editEmoji = (
 guild: Discord.Guild,
 emojiId: string,
 body: Discord.RESTPatchAPIGuildEmojiJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editEmoji(guild.id, emojiId, body, { reason })
  .then((e) => new Classes.GuildEmoji(guild.client, e, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes an emoji from a guild.
 * @param guild - The guild where the emoji is located.
 * @param emojiId - The ID of the emoji to delete.
 * @param reason - The reason for deleting the emoji.
 * @returns A promise that resolves with the deleted emoji, or rejects with a DiscordAPIError.
 */
const deleteEmoji = (guild: Discord.Guild, emojiId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds.deleteEmoji(guild.id, emojiId, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Retrieves scheduled events for a given guild.
 * @param guild - The guild to retrieve scheduled events for.
 * @returns A promise that resolves with an array of parsed scheduled events.
 */
const getScheduledEvents = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getScheduledEvents(guild.id)
  .then((events) => {
   const parsed = events.map((e) => new Classes.GuildScheduledEvent(guild.client, e));
   parsed.forEach((p) => {
    if (guild.scheduledEvents.cache.get(p.id)) return;
    guild.scheduledEvents.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates a scheduled event for a guild.
 * @param guild The guild to create the scheduled event for.
 * @param body The data for the scheduled event.
 * @param reason The reason for creating the scheduled event.
 * @returns A promise that resolves with the created scheduled event
 * or rejects with a DiscordAPIError.
 */
const createScheduledEvent = async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildScheduledEventJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .createScheduledEvent(
   guild.id,
   {
    ...body,
    image: body.image ? await Discord.DataResolver.resolveImage(body.image) : body.image,
   },
   { reason },
  )
  .then((e) => new Classes.GuildScheduledEvent(guild.client, e))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves a scheduled event from the specified guild.
 * @param guild - The guild to retrieve the scheduled event from.
 * @param eventId - The ID of the scheduled event to retrieve.
 * @param query - Optional query parameters to include in the request.
 * @returns A Promise that resolves with the retrieved scheduled event, or rejects with an error.
 */
const getScheduledEvent = (
 guild: Discord.Guild,
 eventId: string,
 query?: Discord.RESTGetAPIGuildScheduledEventQuery,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getScheduledEvent(guild.id, eventId, query)
  .then((e) => {
   const parsed = new Classes.GuildScheduledEvent(guild.client, e);
   if (guild.scheduledEvents.cache.get(parsed.id)) return parsed;
   guild.scheduledEvents.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a scheduled event for a guild.
 * @param guild The guild where the scheduled event belongs.
 * @param eventId The ID of the scheduled event to edit.
 * @param body The new data for the scheduled event.
 * @param reason The reason for editing the scheduled event.
 * @returns A promise that resolves with the edited scheduled event,
 * or rejects with a DiscordAPIError.
 */
const editScheduledEvent = async (
 guild: Discord.Guild,
 eventId: string,
 body: Discord.RESTPatchAPIGuildScheduledEventJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editScheduledEvent(
   guild.id,
   eventId,
   {
    ...body,
    image: body.image ? await Discord.DataResolver.resolveImage(body.image) : body.image,
   },
   { reason },
  )
  .then((e) => new Classes.GuildScheduledEvent(guild.client, e))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes a scheduled event for a guild.
 * @param guild - The guild where the event is scheduled.
 * @param eventId - The ID of the scheduled event to delete.
 * @param reason - The reason for deleting the scheduled event.
 * @returns A promise that resolves with the deleted event, or rejects with a DiscordAPIError.
 */
const deleteScheduledEvent = (guild: Discord.Guild, eventId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .deleteScheduledEvent(guild.id, eventId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the users for a scheduled event in a guild.
 * @param guild The guild to retrieve the scheduled event users from.
 * @param eventId The ID of the scheduled event to retrieve the users for.
 * @param query Optional query parameters for the API request.
 * @returns A Promise that resolves with an array of objects containing the user
 * and member objects for each user in the scheduled event.
 */
const getScheduledEventUsers = (
 guild: Discord.Guild,
 eventId: string,
 query?: Discord.RESTGetAPIGuildScheduledEventUsersQuery,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getScheduledEventUsers(guild.id, eventId, query)
  .then((users) => {
   const parsed = users.map((u) => ({
    user: new Classes.User(guild.client, u.user),
    member: u.member ? new Classes.GuildMember(guild.client, u.member, guild) : undefined,
   }));
   parsed.forEach((p) => {
    const user = () => {
     if (guild.client.users.cache.get(p.user.id)) return;
     guild.client.users.cache.set(p.user.id, p.user);
    };
    const member = () => {
     if (!p.member || guild.members.cache.get(p.member.id)) return;
     guild.members.cache.set(p.member.id, p.member);
    };

    user();
    if (p.member) member();
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the templates for a given guild.
 * @param guild - The guild to retrieve templates for.
 * @returns A promise that resolves with an array of GuildTemplate objects.
 */
const getTemplates = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getTemplates(guild.id)
  .then((templates) => templates.map((t) => new Classes.GuildTemplate(guild.client, t)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Syncs a guild template with the given template code.
 * @param guild The guild to sync the template for.
 * @param templateCode The code of the template to sync.
 * @returns A promise that resolves with the synced guild template,
 * or rejects with a DiscordAPIError.
 */
const syncTemplate = (guild: Discord.Guild, templateCode: string) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .syncTemplate(guild.id, templateCode)
  .then((t) => new Classes.GuildTemplate(guild.client, t))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a guild template.
 * @param guild The guild where the template is located.
 * @param templateCode The code of the template to edit.
 * @param body The new data for the template.
 * @returns A promise that resolves with the edited guild template
 * or rejects with a DiscordAPIError.
 */
const editTemplate = (
 guild: Discord.Guild,
 templateCode: string,
 body: Discord.RESTPatchAPIGuildTemplateJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editTemplate(guild.id, templateCode, body)
  .then((t) => new Classes.GuildTemplate(guild.client, t))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes a guild template.
 * @param guild - The guild where the template is located.
 * @param templateCode - The code of the template to delete.
 * @returns A promise that resolves with the deleted template,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const deleteTemplate = (guild: Discord.Guild, templateCode: string) =>
 (cache.apis.get(guild.id) ?? API).guilds.deleteTemplate(guild.id, templateCode).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Retrieves the stickers for a given guild.
 * @param guild The guild to retrieve the stickers for.
 * @returns A Promise that resolves with an array of parsed Sticker objects.
 */
const getStickers = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getStickers(guild.id)
  .then((stickers) => {
   const parsed = stickers.map((s) => new Classes.Sticker(guild.client, s));
   parsed.forEach((p) => {
    if (guild.stickers.cache.get(p.id)) return;
    guild.stickers.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves a sticker from the cache or the Discord API.
 * @param guild The guild where the sticker is located.
 * @param stickerId The ID of the sticker to retrieve.
 * @returns A Promise that resolves with the retrieved sticker, or rejects with an error.
 */
const getSticker = async (guild: Discord.Guild, stickerId: string) =>
 guild.stickers.cache.get(stickerId) ??
 (cache.apis.get(guild.id) ?? API).guilds
  .getSticker(guild.id, stickerId)
  .then((s) => {
   const parsed = new Classes.Sticker(guild.client, s);
   if (guild.stickers.cache.get(parsed.id)) return parsed;
   guild.stickers.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates a new sticker for the given guild.
 * @param guild The guild to create the sticker in.
 * @param body The sticker data to send in the request.
 * @param body.file The sticker image to upload.
 * @param reason The reason for creating the sticker.
 * @returns A promise that resolves with the created sticker, or rejects with a DiscordAPIError.
 */
const createSticker = (
 guild: Discord.Guild,
 body: Omit<Discord.RESTPostAPIGuildStickerFormDataBody, 'file'> & {
  file: Discord.RawFile;
 },
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .createSticker(guild.id, body, { reason })
  .then((s) => new Classes.Sticker(guild.client, s))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a sticker in a guild.
 * @param guild The guild where the sticker is located.
 * @param stickerId The ID of the sticker to edit.
 * @param body The new data for the sticker.
 * @param reason The reason for editing the sticker.
 * @returns A promise that resolves with the edited sticker, or rejects with a DiscordAPIError.
 */
const editSticker = (
 guild: Discord.Guild,
 stickerId: string,
 body: Discord.RESTPatchAPIGuildStickerJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editSticker(guild.id, stickerId, body, { reason })
  .then((s) => new Classes.Sticker(guild.client, s))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes a sticker from a guild.
 * @param guild The guild to delete the sticker from.
 * @param stickerId The ID of the sticker to delete.
 * @param reason The reason for deleting the sticker.
 * @returns A promise that resolves with the deleted sticker object if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const deleteSticker = (guild: Discord.Guild, stickerId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .deleteSticker(guild.id, stickerId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the audit logs for a given guild.
 * @param guild - The guild to retrieve the audit logs for.
 * @param query - Optional query parameters to filter the audit logs.
 * @returns A promise that resolves to a GuildAuditLogs object
 * representing the audit logs for the guild.
 */
const getAuditLogs = (guild: Discord.Guild, query?: Discord.RESTGetAPIAuditLogQuery) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getAuditLogs(guild.id, query)
  .then((a) => new Classes.GuildAuditLogs(guild, a))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the auto moderation rules for a given guild.
 * @param guild - The guild to retrieve the auto moderation rules for.
 * @returns A promise that resolves with an array of parsed auto moderation rules.
 */
const getAutoModerationRules = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getAutoModerationRules(guild.id)
  .then((rules) => {
   const parsed = rules.map((r) => new Classes.AutoModerationRule(guild.client, r, guild));
   parsed.forEach((p) => {
    if (guild.autoModerationRules.cache.get(p.id)) return;
    guild.autoModerationRules.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves an auto moderation rule from the cache or API.
 * @param guild - The guild to retrieve the rule from.
 * @param ruleId - The ID of the rule to retrieve.
 * @returns A promise that resolves with the retrieved auto moderation rule.
 */
const getAutoModerationRule = async (guild: Discord.Guild, ruleId: string) =>
 guild.autoModerationRules.cache.get(ruleId) ??
 (cache.apis.get(guild.id) ?? API).guilds
  .getAutoModerationRule(guild.id, ruleId)
  .then((r) => {
   const parsed = new Classes.AutoModerationRule(guild.client, r, guild);
   if (guild.autoModerationRules.cache.get(parsed.id)) return parsed;
   guild.autoModerationRules.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates an auto-moderation rule for a guild.
 * @param guild The guild to create the rule for.
 * @param body The JSON body of the auto-moderation rule.
 * @param reason The reason for creating the rule.
 * @returns A promise that resolves with the created auto-moderation rule.
 */
const createAutoModerationRule = (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIAutoModerationRuleJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .createAutoModerationRule(guild.id, body, { reason })
  .then((r) => new Classes.AutoModerationRule(guild.client, r, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits an auto-moderation rule for a guild.
 * @param guild The guild to edit the auto-moderation rule for.
 * @param ruleId The ID of the auto-moderation rule to edit.
 * @param body The new data for the auto-moderation rule.
 * @param reason The reason for editing the auto-moderation rule.
 * @returns A promise that resolves with the updated auto-moderation rule,
 * or rejects with a DiscordAPIError.
 */
const editAutoModerationRule = (
 guild: Discord.Guild,
 ruleId: string,
 body: Discord.RESTPatchAPIAutoModerationRuleJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editAutoModerationRule(guild.id, ruleId, body, { reason })
  .then((r) => new Classes.AutoModerationRule(guild.client, r, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes an auto-moderation rule from a guild.
 * @param guild - The guild to delete the auto-moderation rule from.
 * @param ruleId - The ID of the auto-moderation rule to delete.
 * @param reason - The reason for deleting the auto-moderation rule.
 * @returns A promise that resolves with the deleted auto-moderation rule,
 * or rejects with an error.
 */
const deleteAutoModerationRule = (guild: Discord.Guild, ruleId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .deleteAutoModerationRule(guild.id, ruleId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves a member from a guild by their user ID.
 * @param guild The guild to retrieve the member from.
 * @param userId The ID of the user to retrieve.
 * @returns A Promise that resolves with the GuildMember object,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const getMember = async (guild: Discord.Guild, userId: string) =>
 guild.members.cache.get(userId) ??
 (cache.apis.get(guild.id) ?? API).guilds
  .getMember(guild.id, userId)
  .then((m) => {
   const parsed = new Classes.GuildMember(guild.client, m, guild);
   if (guild.members.cache.get(parsed.id)) return parsed;
   guild.members.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => e as Discord.DiscordAPIError);

/**
 * Searches for members in a guild based on the provided query.
 * @param guild - The guild to search in.
 * @param query - The query to use for searching.
 * @returns A Promise that resolves to an array of GuildMember objects that match the search query.
 */
const searchForMembers = (guild: Discord.Guild, query: Discord.RESTGetAPIGuildMembersSearchQuery) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .searchForMembers(guild.id, query)
  .then((members) => {
   const parsed = members.map((m) => new Classes.GuildMember(guild.client, m, guild));
   parsed.forEach((p) => {
    if (guild.members.cache.get(p.id)) return;
    guild.members.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a member in a guild.
 * @param guild The guild where the member is located.
 * @param userId The ID of the member to edit.
 * @param body The data to update the member with.
 * @param reason The reason for editing the member.
 * @returns A promise that resolves with the updated guild member,
 * or rejects with a DiscordAPIError.
 */
const editMember = (
 guild: Discord.Guild,
 userId: string,
 body: Discord.RESTPatchAPIGuildMemberJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .editMember(guild.id, userId, body, { reason })
  .then((m) => new Classes.GuildMember(guild.client, m, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Removes a member from a guild.
 * @param guild The guild to remove the member from.
 * @param userId The ID of the user to remove.
 * @param reason The reason for removing the member (optional).
 * @returns A promise that resolves with the removed member's data if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const removeMember = (guild: Discord.Guild, userId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds.removeMember(guild.id, userId, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Adds a role to a member in a guild.
 * @param guild - The guild where the member is in.
 * @param userId - The ID of the member to add the role to.
 * @param roleId - The ID of the role to add to the member.
 * @param reason - The reason for adding the role (optional).
 * @returns A promise that resolves with the updated member object if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
const addRoleToMember = (guild: Discord.Guild, userId: string, roleId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .addRoleToMember(guild.id, userId, roleId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Removes a role from a member in a guild.
 * @param guild - The guild where the member is in.
 * @param userId - The ID of the member to remove the role from.
 * @param roleId - The ID of the role to remove from the member.
 * @param reason - The reason for removing the role (optional).
 * @returns A promise that resolves with the removed role or rejects with a DiscordAPIError.
 */
const removeRoleFromMember = (
 guild: Discord.Guild,
 userId: string,
 roleId: string,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .removeRoleFromMember(guild.id, userId, roleId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Returns a Promise that resolves with a new GuildTemplate instance for the given guild.
 * If the guild has an API cache, it will use that cache, otherwise it will use the default API.
 * If an error occurs, it will log the error and return the DiscordAPIError.
 * @param guild The guild to get the template for.
 * @returns A Promise that resolves with a new GuildTemplate instance for the given guild.
 */
const getTemplate = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getTemplate(guild.id)
  .then((t) => new Classes.GuildTemplate(guild.client, t))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates a new template for the specified guild.
 * @param guild The guild to create the template for.
 * @param body The template data to create the template with.
 * @returns A promise that resolves with the created guild template,
 * or rejects with a DiscordAPIError.
 */
const createTemplate = (guild: Discord.Guild, body: Discord.RESTPostAPIGuildTemplatesJSONBody) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .createTemplate(guild.id, body)
  .then((t) => new Classes.GuildTemplate(guild.client, t))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Sets the voice state for the given guild.
 * @param guild - The guild for which the voice state is to be set.
 * @param body - Optional JSON body containing the voice state data.
 * @returns A promise that resolves with the updated voice state,
 * or rejects with a DiscordAPIError.
 */
const setVoiceState = (
 guild: Discord.Guild,
 body?: Discord.RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).guilds.setVoiceState(guild.id, body).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Retrieves the onboarding data for a given guild.
 * @param guild - The guild to retrieve onboarding data for.
 * @returns A promise that resolves with a new instance of the GuildOnboarding class.
 */
const getOnboarding = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getOnboarding(guild.id)
  .then((o) => new Classes.GuildOnboarding(guild.client, o))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the webhooks for a given guild.
 * @param guild The guild to retrieve the webhooks for.
 * @returns A promise that resolves with an array of Webhook objects.
 */
const getWebhooks = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getWebhooks(guild.id)
  .then((webhooks) => webhooks.map((w) => new Classes.Webhook(guild.client, w)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves a list of bans for the specified guild.
 * @param guild - The guild to retrieve the bans for.
 * @param query - An optional query to filter the results.
 * @returns A promise that resolves with an array of GuildBan objects.
 */
const getMemberBans = (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildBansQuery) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getMemberBans(guild.id, query)
  .then((bans) => {
   const parsed = bans.map((b) => new Classes.GuildBan(guild.client, b, guild));
   parsed.forEach((p) => {
    if (guild.bans.cache.get(p.user.id)) return;
    guild.bans.cache.set(p.user.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * This module contains methods for interacting with guilds in Discord.
 * @typedef {Object} GuildMethods
 * @property {Function} edit
 * - Edits a guild.
 * @property {Function} delete
 * - Deletes a guild.
 * @property {Function} getChannels
 * - Gets the channels in a guild.
 * @property {Function} getWidgetImage
 * - Gets the widget image for a guild.
 * @property {Function} getVanityURL
 * - Gets the vanity URL for a guild.
 * @property {Function} getWelcomeScreen
 * - Gets the welcome screen for a guild.
 * @property {Function} editWelcomeScreen
 * - Edits the welcome screen for a guild.
 * @property {Function} getWidgetSettings
 * - Gets the widget settings for a guild.
 * @property {Function} editWidgetSettings
 * - Edits the widget settings for a guild.
 * @property {Function} getWidget
 * - Gets the widget for a guild.
 * @property {Function} getInvites
 * - Gets the invites for a guild.
 * @property {Function} getIntegrations
 * - Gets the integrations for a guild.
 * @property {Function} deleteIntegration
 * - Deletes an integration for a guild.
 * @property {Function} getVoiceRegions
 * - Gets the voice regions for a guild.
 * @property {Function} beginPrune
 * - Begins a prune operation for a guild.
 * @property {Function} getAuditLogs
 * - Gets the audit logs for a guild.
 * @property {Function} getAutoModerationRules
 * - Gets the auto-moderation rules for a guild.
 * @property {Function} getAutoModerationRule
 * - Gets an auto-moderation rule for a guild.
 * @property {Function} createAutoModerationRule
 * - Creates an auto-moderation rule for a guild.
 * @property {Function} editAutoModerationRule
 * - Edits an auto-moderation rule for a guild.
 * @property {Function} deleteAutoModerationRule
 * - Deletes an auto-moderation rule for a guild.
 * @property {Function} getEmojis
 * - Gets the emojis for a guild.
 * @property {Function} getEmoji
 * - Gets an emoji for a guild.
 * @property {Function} createEmoji
 * - Creates an emoji for a guild.
 * @property {Function} editEmoji
 * - Edits an emoji for a guild.
 * @property {Function} deleteEmoji
 * - Deletes an emoji for a guild.
 * @property {Function} getMembers
 * - Gets the members for a guild.
 * @property {Function} getMember
 * - Gets a member for a guild.
 * @property {Function} searchForMembers
 * - Searches for members in a guild.
 * @property {Function} editMember
 * - Edits a member in a guild.
 * @property {Function} removeMember
 * - Removes a member from a guild.
 * @property {Function} addRoleToMember
 * - Adds a role to a member in a guild.
 * @property {Function} removeRoleFromMember
 * - Removes a role from a member in a guild.
 * @property {Function} getRoles
 * - Gets the roles for a guild.
 * @property {Function} createRole
 * -
 *  Creates a role for a guild.
 * @property {Function} editRole
 * - Edits a role for a guild.
 * @property {Function} deleteRole
 * - Deletes a role for a guild.
 * @property {Function} getPruneCount
 * - Gets the prune count for a guild.
 * @property {Function} deleteScheduledEvent
 * - Deletes a scheduled event for a guild.
 * @property {Function} editScheduledEvent
 * - Edits a scheduled event for a guild.
 * @property {Function} createScheduledEvent
 * - Creates a scheduled event for a guild.
 * @property {Function} getScheduledEvent
 * - Gets a scheduled event for a guild.
 * @property {Function} getScheduledEvents
 * - Gets the scheduled events for a guild.
 * @property {Function} getScheduledEventUsers
 * - Gets the users for a scheduled event in a guild.
 * @property {Function} getStickers
 * - Gets the stickers for a guild.
 * @property {Function} getSticker
 * - Gets a sticker for a guild.
 * @property {Function} createSticker
 * - Creates a sticker for a guild.
 * @property {Function} editSticker
 * - Edits a sticker for a guild.
 * @property {Function} deleteSticker
 * - Deletes a sticker for a guild.
 * @property {Function} getTemplates
 * - Gets the templates for a guild.
 * @property {Function} getTemplate
 * - Gets a template for a guild.
 * @property {Function} createTemplate
 * - Creates a template for a guild.
 * @property {Function} editTemplate
 * - Edits a template for a guild.
 * @property {Function} deleteTemplate
 * - Deletes a template for a guild.
 * @property {Function} getWebhooks
 * - Gets the webhooks for a guild.
 * @property {Function} getMemberBans
 * - Gets the bans for a guild.
 * @property {Function} getOnboarding
 * - Gets the onboarding for a guild.
 * @property {Function} setVoiceState
 * - Sets the voice state for a guild.
 * @property {Function} syncTemplate
 * - Syncs a template for a guild.
 * @property {Function} editUserVoiceState
 * - Edits the voice state for a user in a guild.
 * @property {Function} editMFALevel
 * - Edits the MFA level for a guild.
 * @property {Function} getPreview
 * - Gets the preview for a guild.
 * @property {Function} create
 * - Creates a guild.
 * @property {Function} createChannel
 * - Creates a channel in a guild.
 * @property {Function} setChannelPositions
 * - Sets the positions of channels in a guild.
 * @property {Function} getActiveThreads
 * - Gets the active threads in a guild.
 * @property {Function} getMemberBan
 * - Gets a ban for a member in a guild.
 * @property {Function} banUser
 * - Bans a user from a guild.
 * @property {Function} unbanUser
 * - Unbans a user from a guild.
 * @property {Function} getRolePositions
 * - Gets the positions of roles in a guild.
 */
export default {
 edit,
 delete: del,
 getChannels,
 getWidgetImage,
 getVanityURL,
 getWelcomeScreen,
 editWelcomeScreen,
 getWidgetSettings,
 editWidgetSettings,
 getWidget,
 getInvites,
 getIntegrations,
 deleteIntegration,
 getVoiceRegions,
 beginPrune,
 getAuditLogs,
 getAutoModerationRules,
 getAutoModerationRule,
 createAutoModerationRule,
 editAutoModerationRule,
 deleteAutoModerationRule,
 getEmojis,
 getEmoji,
 createEmoji,
 editEmoji,
 deleteEmoji,
 getMembers,
 getMember,
 searchForMembers,
 editMember,
 removeMember,
 addRoleToMember,
 removeRoleFromMember,
 getRoles,
 createRole,
 editRole,
 deleteRole,
 getPruneCount,
 deleteScheduledEvent,
 editScheduledEvent,
 createScheduledEvent,
 getScheduledEvent,
 getScheduledEvents,
 getScheduledEventUsers,
 getStickers,
 getSticker,
 createSticker,
 editSticker,
 deleteSticker,
 getTemplates,
 getTemplate,
 createTemplate,
 editTemplate,
 deleteTemplate,
 getWebhooks,
 getMemberBans,
 getOnboarding,
 setVoiceState,
 syncTemplate,
 editUserVoiceState,
 editMFALevel,
 getPreview,
 create,
 createChannel,
 setChannelPositions,
 getActiveThreads,
 getMemberBan,
 banUser,
 unbanUser,
 setRolePositions,
};
