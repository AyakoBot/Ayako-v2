import type * as Discord from 'discord.js';
import type Jobs from 'node-schedule';
import fetch from 'node-fetch';
import type * as CT from '../../Typings/CustomTypings';
import auth from '../../auth.json' assert { type: 'json' };

const cache: {
 // Discord Cache
 invites: {
  get: (code: string, channelId: string, guildId: string) => Promise<number | undefined>;
  set: (invite: Discord.Invite, guildId: string) => void;
  find: (code: string) => number | undefined;
  delete: (code: string, guildId: string, channelId: string) => void;
  cache: Map<string, Map<string, Map<string, number>>>;
 };
 webhooks: {
  get: (
   webhookId: string,
   channelId: string,
   guildId: string,
  ) => Promise<Discord.Webhook | undefined>;
  set: (webhook: Discord.Webhook) => void;
  find: (webhookId: string) => Discord.Webhook | undefined;
  delete: (webhookId: string) => void;
  cache: Map<string, Map<string, Map<string, Discord.Webhook>>>;
 };
 integrations: {
  get: (integrationId: string, guildId: string) => Promise<Discord.Integration | undefined>;
  set: (integration: Discord.Integration, guildId: string) => void;
  find: (integrationId: string) => Discord.Integration | undefined;
  delete: (integrationId: string, guildId: string) => void;
  cache: Map<string, Map<string, Discord.Integration>>;
 };
 scheduledEventUsers: {
  add: (user: Discord.User, guildId: string, scheduledEventId: string) => void;
  remove: (user: Discord.User, guildId: string, scheduledEventId: string) => void;
  cache: Map<string, Map<string, Map<string, Discord.User>>>;
 };
 welcomeScreens: {
  get: (guildId: string) => Promise<Discord.WelcomeScreen | undefined>;
  set: (welcomeScreen: Discord.WelcomeScreen) => void;
  delete: (guildId: string) => void;
  cache: Map<string, Discord.WelcomeScreen>;
 };
 pins: {
  get: (msgId: string, channelId: string, guildId: string) => Promise<Discord.Message | undefined>;
  set: (msg: Discord.Message) => void;
  find: (msgId: string) => Discord.Message | undefined;
  delete: (msgId: string) => void;
  cache: Map<string, Map<string, Map<string, Discord.Message>>>;
 };
 inviteGuilds: {
  get: (guildId: string) => Discord.InviteGuild | undefined;
  set: (guildId: string, inviteGuild: Discord.InviteGuild) => void;
  delete: (guildId: string) => void;
  cache: Map<string, Discord.InviteGuild>;
 };
 onboarding: {
  get: (guildId: string) => Promise<CT.Onboarding | undefined>;
  set: (guildId: string, onboarding: CT.Onboarding) => void;
  delete: (guildId: string) => void;
  cache: Map<string, CT.Onboarding>;
 };
 commandPermissions: {
  get: (
   guildId: string,
   commandId: string,
  ) => Promise<Discord.ApplicationCommandPermissions[] | undefined>;
  set: (
   guildId: string,
   commandId: string,
   permissions: Discord.ApplicationCommandPermissions[],
  ) => void;
  delete: (guildId: string, commandId: string) => void;
  cache: Map<string, Map<string, Discord.ApplicationCommandPermissions[]>>;
 };

 // Cache
 giveawayClaimTimeout: {
  set: (job: Jobs.Job, guildId: string, msgId: string) => void;
  delete: (guildId: string, msgId: string) => void;
  cache: Map<string, Map<string, Jobs.Job>>;
 };
 mutes: {
  set: (job: Jobs.Job, guildId: string, userId: string) => void;
  delete: (guildId: string, userId: string) => void;
  cache: Map<string, Map<string, Jobs.Job>>;
 };
 bans: {
  set: (job: Jobs.Job, guildId: string, userId: string) => void;
  delete: (guildId: string, userId: string) => void;
  cache: Map<string, Map<string, Jobs.Job>>;
 };
 channelBans: {
  set: (job: Jobs.Job, guildId: string, channelId: string, userId: string) => void;
  delete: (guildId: string, channelId: string, userId: string) => void;
  cache: Map<string, Map<string, Map<string, Jobs.Job>>>;
 };
 reminders: {
  set: (job: Jobs.Job, userId: string, timestamp: number) => void;
  delete: (userId: string, timestamp: number) => void;
  cache: Map<string, Map<number, Jobs.Job>>;
 };
 disboardBumpReminders: {
  set: (job: Jobs.Job, guildId: string) => void;
  delete: (guildId: string) => void;
  cache: Map<string, Jobs.Job>;
 };
 giveaways: {
  set: (job: Jobs.Job, guildId: string, channelId: string, msgId: string) => void;
  delete: (guildId: string, channelId: string, msgId: string) => void;
  cache: Map<string, Map<string, Map<string, Jobs.Job>>>;
 };
 stickyTimeouts: {
  set: (channelId: string, job: Jobs.Job) => void;
  delete: (channelId: string) => void;
  cache: Map<string, Jobs.Job>;
 };
} = {
 invites: {
  get: async (code, channelId, guildId) => {
   const cached = cache.invites.cache.get(guildId)?.get(channelId)?.get(code);
   if (cached) return cached;

   cache.invites.cache.get(guildId)?.clear();

   const client = (await import('../Client.js')).default;
   const fetched = await client.guilds.cache.get(guildId)?.invites.fetch();
   fetched?.forEach((f) => {
    cache.invites.set(f, guildId);
   });

   return Number(fetched?.find((f) => f.code === code));
  },
  set: (invite, guildId) => {
   if (!invite.channelId) {
    // eslint-disable-next-line no-console
    console.error('Invite without channel ID found!', invite);
    return;
   }

   if (!cache.invites.cache.get(guildId)) {
    cache.invites.cache.set(guildId, new Map());
   }

   if (!cache.invites.cache.get(guildId)?.get(invite.channelId)) {
    cache.invites.cache.get(guildId)?.set(invite.channelId, new Map());
   }

   cache.invites.cache.get(guildId)?.get(invite.channelId)?.set(invite.code, Number(invite.uses));
  },
  find: (code) =>
   Array.from(cache.invites.cache, ([, g]) => g)
    .map((c) => Array.from(c, ([, i]) => i))
    .flat()
    .find((c) => c.get(code))
    ?.get(code),
  delete: (code, guildId, channelId) => {
   const cached = cache.invites.find(code);
   if (!cached || !channelId) return;

   if (cache.invites.cache.get(guildId)?.size === 1) {
    if (cache.invites.cache.get(guildId)?.get(channelId)?.size === 1) {
     cache.invites.cache.get(guildId)?.get(channelId)?.clear();
    } else {
     cache.invites.cache.get(guildId)?.get(channelId)?.delete(code);
    }
   } else if (cache.invites.cache.get(guildId)?.get(channelId)?.size === 1) {
    cache.invites.cache.get(guildId)?.delete(channelId);
   } else {
    cache.invites.cache.get(guildId)?.get(channelId)?.delete(code);
   }
  },
  cache: new Map(),
 },
 webhooks: {
  get: async (id, channelId, guildId) => {
   const cached = cache.webhooks.cache.get(guildId)?.get(channelId)?.get(id);
   if (cached) return cached;

   const client = (await import('../Client.js')).default;
   const fetched = await client.guilds.cache.get(guildId)?.fetchWebhooks();
   fetched?.forEach((f) => cache.webhooks.set(f));

   return fetched?.find((f) => f.id === id);
  },
  set: (webhook) => {
   if (!cache.webhooks.cache.get(webhook.guildId)) {
    cache.webhooks.cache.set(webhook.guildId, new Map());
   }

   if (!cache.webhooks.cache.get(webhook.guildId)?.get(webhook.channelId)) {
    cache.webhooks.cache.get(webhook.guildId)?.set(webhook.channelId, new Map());
   }

   if (webhook.channelId) {
    cache.webhooks.cache.get(webhook.guildId)?.get(webhook.channelId)?.set(webhook.id, webhook);
   }
  },
  find: (id) =>
   Array.from(cache.webhooks.cache, ([, g]) => g)
    .map((c) => Array.from(c, ([, i]) => i))
    .flat()
    .find((c) => c.get(id))
    ?.get(id),
  delete: (id) => {
   const cached = cache.webhooks.find(id);
   if (!cached || !cached.guildId || !cached.channelId) return;

   if (cache.webhooks.cache.get(cached.guildId)?.size === 1) {
    if (cache.webhooks.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
     cache.webhooks.cache.get(cached.guildId)?.get(cached.channelId)?.clear();
    } else {
     cache.webhooks.cache.get(cached.guildId)?.get(cached.channelId)?.delete(id);
    }
   } else if (cache.webhooks.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
    cache.webhooks.cache.get(cached.guildId)?.delete(cached.channelId);
   } else {
    cache.webhooks.cache.get(cached.guildId)?.get(cached.channelId)?.delete(id);
   }
  },
  cache: new Map(),
 },
 integrations: {
  get: async (id, guildId) => {
   const cached = cache.integrations.cache.get(guildId)?.get(id);
   if (cached) return cached;

   const client = (await import('../Client.js')).default;
   const fetched = await client.guilds.cache.get(guildId)?.fetchIntegrations();
   fetched?.forEach((f) => cache.integrations.set(f, guildId));

   return fetched?.find((f) => f.id === id);
  },
  set: (integration, guildId) => {
   if (!cache.integrations.cache.get(guildId)) {
    cache.integrations.cache.set(guildId, new Map());
   }
   cache.integrations.cache.get(guildId)?.set(integration.id, integration);
  },
  find: (id) =>
   Array.from(cache.integrations.cache, ([, g]) => g)
    .map((c) => Array.from(c, ([, i]) => i))
    .flat()
    .find((r) => r.id === id),
  delete: (id, guildId) => {
   const cached = cache.integrations.find(id);
   if (!cached) return;

   if (cache.integrations.cache.get(guildId)?.size === 1) {
    cache.integrations.cache.delete(guildId);
   } else {
    cache.integrations.cache.get(guildId)?.delete(id);
   }
  },
  cache: new Map(),
 },
 scheduledEventUsers: {
  add: (user: Discord.User, guildId: string, eventId: string) => {
   if (!cache.scheduledEventUsers.cache.get(guildId)) {
    cache.scheduledEventUsers.cache.set(guildId, new Map());
   }

   if (!cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)) {
    cache.scheduledEventUsers.cache.get(guildId)?.set(eventId, new Map());
   }

   cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)?.set(user.id, user);
  },
  remove: (user: Discord.User, guildId: string, eventId: string) => {
   const cached = cache.scheduledEventUsers.cache.get(guildId);
   if (!cached) return;

   if (cache.scheduledEventUsers.cache.size < 2) {
    if (cache.scheduledEventUsers.cache.get(guildId)?.size === 1) {
     if (cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)?.size === 1) {
      cache.scheduledEventUsers.cache.clear();
     } else {
      cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)?.delete(user.id);
     }
    } else {
     cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)?.delete(user.id);
    }
   } else {
    cache.scheduledEventUsers.cache.get(guildId)?.get(eventId)?.delete(user.id);
   }
  },
  cache: new Map(),
 },
 welcomeScreens: {
  get: async (guildId) => {
   const cached = cache.welcomeScreens.cache.get(guildId);
   if (cached) return cached;

   const client = (await import('../Client.js')).default;
   const fetched = await client.guilds.cache.get(guildId)?.fetchWelcomeScreen();
   if (!fetched) return undefined;

   cache.welcomeScreens.set(fetched);
   return fetched;
  },
  set: (screen: Discord.WelcomeScreen) => {
   cache.welcomeScreens.cache.set(screen.guild.id, screen);
  },
  delete: (guildId) => {
   cache.welcomeScreens.cache.delete(guildId);
  },
  cache: new Map(),
 },
 pins: {
  get: async (id, channelId, guildId) => {
   const cached = cache.pins.cache.get(guildId)?.get(channelId)?.get(id);
   if (cached) return cached;

   const getChannel = await import('./getChannel.js');
   const fetched = await (await getChannel.guildTextChannel(channelId))?.messages.fetchPinned();
   fetched?.forEach((f) => cache.pins.set(f));

   return fetched?.find((f) => f.id === id);
  },
  set: (msg) => {
   if (!msg.guildId) return;

   if (!cache.pins.cache.get(msg.guildId)) {
    cache.pins.cache.set(msg.guildId, new Map());
   }

   if (!cache.pins.cache.get(msg.guildId)?.get(msg.channelId)) {
    cache.pins.cache.get(msg.guildId)?.set(msg.channelId, new Map());
   }

   cache.pins.cache.get(msg.guildId)?.get(msg.channelId)?.set(msg.id, msg);
  },
  find: (id) =>
   Array.from(cache.pins.cache, ([, g]) => g)
    .map((c) => Array.from(c, ([, i]) => i))
    .flat()
    .find((c) => c.get(id))
    ?.get(id),
  delete: (id) => {
   const cached = cache.pins.find(id);
   if (!cached || !cached.guildId || !cached.channelId) return;

   if (cache.pins.cache.get(cached.guildId)?.size === 1) {
    if (cache.pins.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
     cache.pins.cache.get(cached.guildId)?.get(cached.channelId)?.clear();
    } else {
     cache.pins.cache.get(cached.guildId)?.get(cached.channelId)?.delete(id);
    }
   } else if (cache.pins.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
    cache.pins.cache.get(cached.guildId)?.delete(cached.channelId);
   } else {
    cache.pins.cache.get(cached.guildId)?.get(cached.channelId)?.delete(id);
   }
  },
  cache: new Map(),
 },
 inviteGuilds: {
  get: (id) => cache.inviteGuilds.cache.get(id),
  set: (id, guild) => cache.inviteGuilds.cache.set(id, guild),
  delete: (id) => {
   cache.inviteGuilds.cache.delete(id);
  },
  cache: new Map(),
 },
 onboarding: {
  get: async (id) => {
   const cached = cache.onboarding.cache.get(id);
   if (cached) return cached;

   const response = await fetch(`https://discord.com/api/v10/guilds/${id}/onboarding`, {
    headers: {
     Authorization: `Bot ${auth.token}`,
    },
   });
   if (!response.ok) return undefined;
   const res = (await response.json()) as {
    guild_id: string;
    default_channel_ids: string[];
    enabled: boolean;
    prompts: {
     id: string;
     type: 0 | 1;
     options: {
      id: string;
      channel_ids: string[];
      role_ids: string[];
      title: string;
      description?: string;
     }[];
     title: string;
     single_select: boolean;
     required: boolean;
     in_onboarding: boolean;
    }[];
   };

   const onboarding: CT.Onboarding = {
    guildId: res.guild_id,
    defaultChannelIds: res.default_channel_ids,
    enabled: res.enabled,
    prompts: res.prompts.map((p) => ({
     id: p.id,
     type: p.type,
     options: p.options.map((o) => ({
      id: o.id,
      channelIds: o.channel_ids,
      roleIds: o.role_ids,
      title: o.title,
      description: o.description,
     })),
     title: p.title,
     singleSelect: p.single_select,
     required: p.required,
     inOnboarding: p.in_onboarding,
    })),
   };

   cache.onboarding.set(id, onboarding);
   return onboarding;
  },
  set: (id, onboarding) => {
   cache.onboarding.cache.set(id, onboarding);
  },
  delete: (id) => {
   cache.onboarding.cache.delete(id);
  },
  cache: new Map(),
 },
 commandPermissions: {
  get: async (guildId, commandId) => {
   const cached = cache.commandPermissions.cache.get(guildId)?.get(commandId);
   if (cached) return cached;

   const client = (await import('../Client.js')).default;
   const fetched = await client.application?.commands.permissions.fetch({ guild: guildId });

   cache.commandPermissions.cache.get(guildId)?.clear();
   fetched?.forEach((f, id) => cache.commandPermissions.set(guildId, id, f));

   return fetched?.find((_, id) => id === commandId);
  },
  set: (guildId, commandId, permissions) => {
   if (!cache.commandPermissions.cache.get(guildId)) {
    cache.commandPermissions.cache.set(guildId, new Map());
   }
   cache.commandPermissions.cache.get(guildId)?.set(commandId, permissions);
  },
  delete: (guildId, commandId) => {
   if (cache.commandPermissions.cache.get(guildId)?.size === 1) {
    cache.commandPermissions.cache.delete(guildId);
   } else {
    cache.commandPermissions.cache.get(guildId)?.delete(commandId);
   }
  },
  cache: new Map(),
 },

 giveawayClaimTimeout: {
  set: (job, guildId, msgId) => {
   const cached = cache.giveawayClaimTimeout.cache.get(guildId)?.get(msgId);
   cached?.cancel();

   if (!cache.giveawayClaimTimeout.cache.get(guildId)) {
    cache.giveawayClaimTimeout.cache.set(guildId, new Map());
   }
   cache.giveawayClaimTimeout.cache.get(guildId)?.set(msgId, job);
  },
  delete: (guildId, msgId) => {
   const cached = cache.giveawayClaimTimeout.cache.get(guildId)?.get(msgId);
   cached?.cancel();

   if (cache.giveawayClaimTimeout.cache.get(guildId)?.size === 1) {
    cache.giveawayClaimTimeout.cache.delete(guildId);
   } else {
    cache.giveawayClaimTimeout.cache.get(guildId)?.delete(msgId);
   }
  },
  cache: new Map(),
 },
 mutes: {
  set: (job, guildId, userId) => {
   const cached = cache.mutes.cache.get(guildId)?.get(userId);
   cached?.cancel();

   if (!cache.mutes.cache.get(guildId)) {
    cache.mutes.cache.set(guildId, new Map());
   }
   cache.mutes.cache.get(guildId)?.set(userId, job);
  },
  delete: (guildId, userId) => {
   const cached = cache.mutes.cache.get(guildId)?.get(userId);
   cached?.cancel();

   if (cache.mutes.cache.get(guildId)?.size === 1) {
    cache.mutes.cache.delete(guildId);
   } else {
    cache.mutes.cache.get(guildId)?.delete(userId);
   }
  },
  cache: new Map(),
 },
 bans: {
  set: (job, guildId, userId) => {
   const cached = cache.bans.cache.get(guildId)?.get(userId);
   cached?.cancel();

   if (!cache.bans.cache.get(guildId)) {
    cache.bans.cache.set(guildId, new Map());
   }
   cache.bans.cache.get(guildId)?.set(userId, job);
  },
  delete: (guildId, userId) => {
   const cached = cache.bans.cache.get(guildId)?.get(userId);
   cached?.cancel();

   if (cache.bans.cache.get(guildId)?.size === 1) {
    cache.bans.cache.delete(guildId);
   } else {
    cache.bans.cache.get(guildId)?.delete(userId);
   }
  },
  cache: new Map(),
 },
 channelBans: {
  set: (job, guildId, channelId, userId) => {
   const cached = cache.channelBans.cache.get(guildId)?.get(channelId)?.get(userId);
   cached?.cancel();

   if (!cache.channelBans.cache.get(guildId)) {
    cache.channelBans.cache.set(guildId, new Map());
   }

   if (!cache.channelBans.cache.get(guildId)?.get(channelId)) {
    cache.channelBans.cache.get(guildId)?.set(channelId, new Map());
   }

   cache.channelBans.cache.get(guildId)?.get(channelId)?.set(userId, job);
  },
  delete: (guildId, channelId, userId) => {
   const cached = cache.channelBans.cache.get(guildId)?.get(channelId)?.get(userId);
   cached?.cancel();

   if (cache.channelBans.cache.get(guildId)?.size === 1) {
    if (cache.channelBans.cache.get(guildId)?.get(channelId)?.size === 1) {
     cache.channelBans.cache.get(guildId)?.get(channelId)?.clear();
    } else cache.channelBans.cache.get(guildId)?.get(channelId)?.delete(userId);
   } else if (cache.channelBans.cache.get(guildId)?.get(channelId)?.size === 1) {
    cache.channelBans.cache.get(guildId)?.delete(channelId);
   } else {
    cache.channelBans.cache.get(guildId)?.get(channelId)?.delete(userId);
   }
  },
  cache: new Map(),
 },
 reminders: {
  set: (job, userId, timestamp) => {
   const cached = cache.reminders.cache.get(userId)?.get(timestamp);
   cached?.cancel();

   if (!cache.reminders.cache.get(userId)) {
    cache.reminders.cache.set(userId, new Map());
   }
   cache.reminders.cache.get(userId)?.set(timestamp, job);
  },
  delete: (userId, timestamp) => {
   const cached = cache.reminders.cache.get(userId)?.get(timestamp);
   cached?.cancel();

   if (cache.reminders.cache.get(userId)?.size === 1) {
    cache.reminders.cache.delete(userId);
   } else {
    cache.reminders.cache.get(userId)?.delete(timestamp);
   }
  },
  cache: new Map(),
 },
 disboardBumpReminders: {
  set: (job, guildId) => {
   const cached = cache.disboardBumpReminders.cache.get(guildId);
   cached?.cancel();

   cache.disboardBumpReminders.cache.set(guildId, job);
  },
  delete: (guildId) => {
   const cached = cache.disboardBumpReminders.cache.get(guildId);
   cached?.cancel();
   cache.disboardBumpReminders.cache.delete(guildId);
  },
  cache: new Map(),
 },
 giveaways: {
  set: (job, guildId, channelId, msgId) => {
   const cached = cache.giveaways.cache.get(guildId)?.get(channelId)?.get(msgId);
   cached?.cancel();

   if (!cache.giveaways.cache.get(guildId)) {
    cache.giveaways.cache.set(guildId, new Map());
   }

   if (!cache.giveaways.cache.get(guildId)?.get(channelId)) {
    cache.giveaways.cache.get(guildId)?.set(channelId, new Map());
   }

   cache.giveaways.cache.get(guildId)?.get(channelId)?.set(msgId, job);
  },
  delete: (guildId, channelId, msgId) => {
   const cached = cache.giveaways.cache.get(guildId)?.get(channelId)?.get(msgId);
   cached?.cancel();

   if (cache.giveaways.cache.get(guildId)?.size === 1) {
    if (cache.giveaways.cache.get(guildId)?.get(channelId)?.size === 1) {
     cache.giveaways.cache.get(guildId)?.get(channelId)?.clear();
    } else cache.giveaways.cache.get(guildId)?.get(channelId)?.delete(msgId);
   } else if (cache.giveaways.cache.get(guildId)?.get(channelId)?.size === 1) {
    cache.giveaways.cache.get(guildId)?.delete(channelId);
   } else {
    cache.giveaways.cache.get(guildId)?.get(channelId)?.delete(msgId);
   }
  },
  cache: new Map(),
 },
 stickyTimeouts: {
  set: (channelId, job) => {
   const cached = cache.stickyTimeouts.cache.get(channelId);
   cached?.cancel();

   cache.stickyTimeouts.cache.set(channelId, job);
  },
  delete: (channelId) => {
   const cached = cache.stickyTimeouts.cache.get(channelId);
   cached?.cancel();
   cache.stickyTimeouts.cache.delete(channelId);
  },
  cache: new Map(),
 },
};

export default cache;
