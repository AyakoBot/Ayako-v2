import * as DDeno from 'discordeno';
import type Jobs from 'node-schedule';
import client from '../DDenoClient.js';
import type CT from '../../Typings/CustomTypings';

const cache: {
  // Discord Cache
  users: {
    get: (userId: bigint) => Promise<DDeno.User | undefined>;
    set: (user: DDeno.User) => void;
    delete: (userId: bigint) => void;
    cache: Map<bigint, DDeno.User>;
  };
  members: {
    get: (memberId: bigint, guildId: bigint) => Promise<DDeno.Member | undefined>;
    set: (member: DDeno.Member) => void;
    delete: (memberId: bigint, guildId: bigint) => void;
    find: (memberId: bigint) => DDeno.Member[] | undefined;
    cache: Map<bigint, Map<bigint, DDeno.Member>>;
  };
  invites: {
    get: (
      code: string,
      channelId: bigint,
      guildId: bigint,
    ) => Promise<DDeno.InviteMetadata | undefined>;
    set: (invite: DDeno.InviteMetadata) => void;
    find: (code: string) => DDeno.InviteMetadata | undefined;
    delete: (code: string) => void;
    cache: Map<bigint, Map<bigint, Map<string, DDeno.InviteMetadata>>>;
  };
  webhooks: {
    get: (
      webhookId: bigint,
      channelId: bigint,
      guildId: bigint,
    ) => Promise<DDeno.Webhook | undefined>;
    set: (webhook: DDeno.Webhook) => void;
    find: (webhookId: bigint) => DDeno.Webhook | undefined;
    delete: (webhookId: bigint) => void;
    cache: Map<bigint, Map<bigint, Map<bigint, DDeno.Webhook>>>;
  };
  automodRules: {
    get: (automodRuleId: bigint, guildId: bigint) => Promise<DDeno.AutoModerationRule | undefined>;
    set: (automodRule: DDeno.AutoModerationRule) => void;
    find: (automodRuleId: bigint) => DDeno.AutoModerationRule | undefined;
    delete: (automodRuleId: bigint) => void;
    cache: Map<bigint, Map<bigint, DDeno.AutoModerationRule>>;
  };
  emojis: {
    get: (emojiId: bigint, guildId: bigint) => Promise<DDeno.Emoji | undefined>;
    set: (emoji: DDeno.Emoji, guildId: bigint) => void;
    find: (emojiId: bigint) => DDeno.Emoji | undefined;
    delete: (emojiId: bigint, guildId: bigint) => void;
    cache: Map<bigint, Map<bigint, DDeno.Emoji>>;
  };
  integrations: {
    get: (integrationId: bigint, guildId: bigint) => Promise<DDeno.Integration | undefined>;
    set: (integration: DDeno.Integration) => void;
    find: (integrationId: bigint) => DDeno.Integration | undefined;
    delete: (integrationId: bigint) => void;
    cache: Map<bigint, Map<bigint, DDeno.Integration>>;
  };
  reactions: {
    get: (
      emojiId: bigint | string,
      messageId: bigint,
      channelId: bigint,
      guildId: bigint,
    ) => Promise<{ users: bigint[]; emoji: DDeno.Emoji } | undefined>;
    set: (
      reaction: { users: bigint[]; emoji: DDeno.Emoji },
      msgId: bigint,
      channelId: bigint,
      guildId: bigint,
    ) => void;
    delete: (emojiId: bigint | string, msgId: bigint, channelId: bigint, guildId: bigint) => void;
    cache: Map<
      bigint,
      Map<bigint, Map<bigint, Map<bigint | string, { users: bigint[]; emoji: DDeno.Emoji }>>>
    >;
  };
  roles: {
    get: (roleId: bigint, guildId: bigint) => Promise<DDeno.Role | undefined>;
    set: (role: DDeno.Role) => void;
    find: (roleId: bigint) => DDeno.Role | undefined;
    delete: (roleId: bigint) => void;
    cache: Map<bigint, Map<bigint, DDeno.Role>>;
  };
  channels: {
    get: (channelId: bigint, guildId: bigint) => Promise<DDeno.Channel | undefined>;
    set: (channel: DDeno.Channel) => void;
    find: (channelId: bigint) => DDeno.Channel | undefined;
    delete: (channelId: bigint) => void;
    cache: Map<bigint, Map<bigint, DDeno.Channel>>;
  };
  guilds: {
    get: (guildId: bigint) => Promise<DDeno.Guild | undefined>;
    set: (guild: DDeno.Guild) => void;
    delete: (guildId: bigint) => void;
    cache: Map<bigint, DDeno.Guild>;
  };
  messages: {
    get: (id: bigint, channelId: bigint, guildId: bigint) => Promise<DDeno.Message | undefined>;
    set: (message: DDeno.Message) => void;
    find: (messageId: bigint) => DDeno.Message | undefined;
    delete: (messageId: bigint) => void;
    cache: Map<bigint, Map<bigint, Map<bigint, DDeno.Message>>>;
  };
  stickers: {
    get: (id: bigint, guildId: bigint) => Promise<DDeno.Sticker | undefined>;
    set: (sticker: DDeno.Sticker) => void;
    find: (stickerId: bigint) => DDeno.Sticker | undefined;
    delete: (stickerId: bigint) => void;
    cache: Map<bigint, Map<bigint, DDeno.Sticker>>;
  };
  scheduledEvents: {
    get: (id: bigint, guildId: bigint) => Promise<CT.ScheduledEvent | undefined>;
    set: (scheduledEvent: DDeno.ScheduledEvent | CT.ScheduledEvent) => void;
    find: (scheduledEventId: bigint) => CT.ScheduledEvent | undefined;
    delete: (scheduledEventId: bigint) => void;
    cache: Map<bigint, Map<bigint, CT.ScheduledEvent>>;
  };
  stageInstances: {
    get: (id: bigint, guildId: bigint) => Promise<DDeno.StageInstance | undefined>;
    set: (stageInstance: DDeno.StageInstance) => void;
    find: (stageInstanceId: bigint) => DDeno.StageInstance | undefined;
    delete: (stageInstanceId: bigint) => void;
    cache: Map<bigint, Map<bigint, DDeno.StageInstance>>;
  };
  threads: {
    get: (threadId: bigint, channelId: bigint, guildId: bigint) => Promise<CT.Thread | undefined>;
    set: (thread: DDeno.Channel) => void;
    find: (threadId: bigint) => CT.Thread | undefined;
    delete: (threadId: bigint) => void;
    cache: Map<bigint, Map<bigint, Map<bigint, CT.Thread>>>;
  };
  voiceStates: {
    get: (userId: bigint, guildId: bigint) => Promise<DDeno.VoiceState | undefined>;
    set: (voiceState: DDeno.VoiceState) => void;
    find: (userId: bigint) => DDeno.VoiceState | undefined;
    delete: (userId: bigint, guildId: bigint) => void;
    cache: Map<bigint, Map<bigint, DDeno.VoiceState>>;
  };

  // Ayako Cache
  giveawayClaimTimeout: {
    set: (job: Jobs.Job, guildId: bigint, userId: bigint) => void;
    delete: (guildId: bigint, userId: bigint) => void;
    cache: Map<bigint, Map<bigint, Jobs.Job>>;
  };
  mutes: {
    set: (job: Jobs.Job, guildId: bigint, userId: bigint) => void;
    delete: (guildId: bigint, userId: bigint) => void;
    cache: Map<bigint, Map<bigint, Jobs.Job>>;
  };
  bans: {
    set: (job: Jobs.Job, guildId: bigint, userId: bigint) => void;
    delete: (guildId: bigint, userId: bigint) => void;
    cache: Map<bigint, Map<bigint, Jobs.Job>>;
  };
  channelBans: {
    set: (job: Jobs.Job, guildId: bigint, channelId: bigint, userId: bigint) => void;
    delete: (guildId: bigint, channelId: bigint, userId: bigint) => void;
    cache: Map<bigint, Map<bigint, Map<bigint, Jobs.Job>>>;
  };
  reminders: {
    set: (job: Jobs.Job, userId: bigint, timestamp: number) => void;
    delete: (userId: bigint, timestamp: number) => void;
    cache: Map<bigint, Map<number, Jobs.Job>>;
  };
  disboardBumpReminders: {
    set: (job: Jobs.Job, guildId: bigint) => void;
    delete: (guildId: bigint) => void;
    cache: Map<bigint, Jobs.Job>;
  };
  verificationCodes: {
    set: (code: string, guildId: bigint, userId: bigint) => void;
    delete: (guildId: bigint, userId: bigint) => void;
    cache: Map<bigint, Map<bigint, string>>;
  };
  giveaways: {
    set: (job: Jobs.Job, guildId: bigint, channelId: bigint, msgId: bigint) => void;
    delete: (guildId: bigint, channelId: bigint, msgId: bigint) => void;
    cache: Map<bigint, Map<bigint, Map<bigint, Jobs.Job>>>;
  };
} = {
  users: {
    get: async (userId) => {
      const cached = cache.users.cache.get(userId);
      if (cached) return cached;

      const fetched = await client.helpers.getUser(userId);
      cache.users.set(fetched);
      return fetched;
    },
    set: (user) => cache.users.cache.set(user.id, user),
    delete: (userId) => cache.users.delete(userId),
    cache: new Map(),
  },
  members: {
    get: async (memberId, guildId) => {
      const cached = cache.members.cache.get(guildId)?.get(memberId);
      if (cached) return cached;

      const fetched = await client.ch.getMembers(guildId);
      if (!fetched) return undefined;

      fetched.forEach((f) => cache.members.set(f));
      return fetched.find((f) => f.id === memberId);
    },
    set: (member) => {
      if (!cache.members.cache.get(member.guildId)) {
        cache.members.cache.set(member.guildId, new Map());
      }
      cache.members.cache.get(member.guildId)?.set(member.id, member);
    },
    delete: (id, guildId) => {
      const cached = cache.members.cache.get(guildId)?.get(id);
      if (!cached) return;

      if (cache.members.cache.get(cached.guildId)?.size === 1) {
        cache.members.cache.delete(cached.guildId);
      } else {
        cache.members.cache.get(cached.guildId)?.delete(cached.id);
      }
    },
    find: (id) =>
      Array.from(cache.members.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .filter((c) => c.id === id),
    cache: new Map(),
  },
  invites: {
    get: async (code, channelId, guildId) => {
      const cached = cache.invites.cache.get(guildId)?.get(channelId)?.get(code);
      if (cached) return cached;

      cache.invites.cache.get(guildId)?.clear();

      const fetched = await client.helpers.getInvites(guildId);
      fetched.forEach((f) => {
        cache.invites.set(f);
      });

      return fetched.find((f) => f.code === code);
    },
    set: (invite) => {
      if (!invite.guildId || !invite.channelId) {
        // eslint-disable-next-line no-console
        console.error('Invite without channel/guild ID found!', invite);
        return;
      }

      if (!cache.invites.cache.get(BigInt(invite.guildId))) {
        cache.invites.cache.set(BigInt(invite.guildId), new Map());
      }

      if (!cache.invites.cache.get(BigInt(invite.guildId))?.get(BigInt(invite.channelId))) {
        cache.invites.cache.get(BigInt(invite.guildId))?.set(BigInt(invite.channelId), new Map());
      }

      cache.invites.cache
        .get(BigInt(invite.guildId))
        ?.get(BigInt(invite.channelId))
        ?.set(invite.code, invite);
    },
    find: (code) =>
      Array.from(cache.invites.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((c) => c.get(code))
        ?.get(code),
    delete: (code) => {
      const cached = cache.invites.find(code);
      if (!cached || !cached.guildId || !cached.channelId) return;

      if (cache.invites.cache.get(BigInt(cached.guildId))?.size === 1) {
        if (
          cache.invites.cache.get(BigInt(cached.guildId))?.get(BigInt(cached.channelId))?.size === 1
        ) {
          cache.invites.cache.get(BigInt(cached.guildId))?.get(BigInt(cached.channelId))?.clear();
        } else {
          cache.invites.cache
            .get(BigInt(cached.guildId))
            ?.get(BigInt(cached.channelId))
            ?.delete(code);
        }
      } else if (
        cache.invites.cache.get(BigInt(cached.guildId))?.get(BigInt(cached.channelId))?.size === 1
      ) {
        cache.invites.cache.get(BigInt(cached.guildId))?.delete(BigInt(cached.channelId));
      } else {
        cache.invites.cache
          .get(BigInt(cached.guildId))
          ?.get(BigInt(cached.channelId))
          ?.delete(code);
      }
    },
    cache: new Map(),
  },
  webhooks: {
    get: async (id, channelId, guildId) => {
      const cached = cache.webhooks.cache.get(guildId)?.get(channelId)?.get(id);
      if (cached) return cached;

      const fetched = await client.helpers.getGuildWebhooks(guildId);
      fetched.forEach((f) => cache.webhooks.set(f));

      return fetched.find((f) => f.id === id);
    },
    set: (webhook) => {
      if (!webhook.guildId || !webhook.channelId) {
        // eslint-disable-next-line no-console
        console.error('Webhook without channel ID found!', webhook);
        return;
      }

      if (!cache.webhooks.cache.get(webhook.guildId)?.get(webhook.channelId)) {
        cache.webhooks.cache.get(webhook.guildId)?.set(webhook.channelId, new Map());
        // eslint-disable-next-line no-console

        if (webhook.channelId) {
          cache.webhooks.cache
            .get(webhook.guildId)
            ?.get(webhook.channelId)
            ?.set(webhook.id, webhook);
        }
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
  automodRules: {
    get: async (id, guildId) => {
      const cached = cache.automodRules.cache.get(guildId)?.get(id);
      if (cached) return cached;

      const fetched = await client.helpers.getAutomodRules(guildId);
      fetched.forEach((f) => cache.automodRules.set(f));

      return fetched.find((f) => f.id === id);
    },
    set: (rule) => {
      if (!cache.automodRules.cache.get(rule.guildId)) {
        cache.automodRules.cache.set(rule.guildId, new Map());
      }
      cache.automodRules.cache.get(rule.guildId)?.set(rule.id, rule);
    },
    find: (id) =>
      Array.from(cache.automodRules.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((r) => r.id === id),
    delete: (id) => {
      const cached = cache.automodRules.find(id);
      if (!cached) return;

      if (cache.automodRules.cache.get(cached.guildId)?.size === 1) {
        cache.automodRules.cache.delete(cached.guildId);
      } else {
        cache.automodRules.cache.get(cached.guildId)?.delete(cached.id);
      }
    },
    cache: new Map(),
  },
  emojis: {
    get: async (id, guildId) => {
      const cached = cache.emojis.cache.get(guildId)?.get(id);
      if (cached) return cached;

      const fetched = await client.helpers.getEmojis(guildId);
      fetched.forEach((f) => cache.emojis.set(f, guildId));

      return fetched.find((f) => f.id === id);
    },
    set: (emoji, guildId) => {
      if (!emoji.id) return;
      if (!cache.emojis.cache.get(guildId)) cache.emojis.cache.set(guildId, new Map());

      cache.emojis.cache.get(guildId)?.set(emoji.id, emoji);
    },
    find: (id) =>
      Array.from(cache.emojis.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((r) => r.id === id),
    delete: (id, guildId) => {
      const cached = cache.emojis.find(id);
      if (!cached || !cached.id) return;

      if (cache.emojis.cache.get(guildId)?.size === 1) {
        cache.emojis.cache.delete(guildId);
      } else {
        cache.emojis.cache.get(guildId)?.delete(cached.id);
      }
    },
    cache: new Map(),
  },
  integrations: {
    get: async (id, guildId) => {
      const cached = cache.integrations.cache.get(guildId)?.get(id);
      if (cached) return cached;

      const fetched = await client.helpers.getIntegrations(guildId);
      fetched.forEach((f) => cache.integrations.set(f));

      return fetched.find((f) => f.id === id);
    },
    set: (integration) => {
      if (!cache.integrations.cache.get(integration.guildId)) {
        cache.integrations.cache.set(integration.guildId, new Map());
      }
      cache.integrations.cache.get(integration.guildId)?.set(integration.id, integration);
    },
    find: (id) =>
      Array.from(cache.integrations.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((r) => r.id === id),
    delete: (id) => {
      const cached = cache.integrations.find(id);
      if (!cached) return;

      if (cache.integrations.cache.get(cached.guildId)?.size === 1) {
        cache.integrations.cache.delete(cached.guildId);
      } else {
        cache.integrations.cache.get(cached.guildId)?.delete(id);
      }
    },
    cache: new Map(),
  },
  reactions: {
    get: async (id, msgId, channelId, guildId) => {
      const cached = cache.reactions.cache.get(guildId)?.get(channelId)?.get(msgId)?.get(id);
      if (cached) return cached;

      const message = await cache.messages.get(msgId, channelId, guildId);
      if (!message) return undefined;

      const fetched = await client.ch.getReactions(message, channelId, id);
      if (!cache.reactions.cache.get(guildId)) cache.reactions.cache.set(guildId, new Map());
      if (!cache.reactions.cache.get(guildId)?.get(channelId)) {
        cache.reactions.cache.get(guildId)?.set(channelId, new Map());
      }
      if (!cache.reactions.cache.get(guildId)?.get(channelId)?.get(msgId)) {
        cache.reactions.cache.get(guildId)?.get(channelId)?.set(msgId, new Map());
      }

      const getEmoji = (): DDeno.Emoji | undefined => {
        if (typeof id === 'string') {
          return { name: id, toggles: new DDeno.EmojiToggles({ name: id }) };
        }

        if (typeof id === 'bigint') {
          return (
            cache.emojis.find(id) ?? {
              id,
              toggles: new DDeno.EmojiToggles({ id: String(id), require_colons: true }),
            }
          );
        }

        return undefined;
      };

      const emoji = getEmoji();
      if (!emoji) return undefined;

      const reaction = { users: fetched.map((o) => o.id), emoji };
      cache.reactions.set(reaction, msgId, channelId, guildId);

      return reaction;
    },
    set: (reaction, msgId, channelId, guildId) => {
      const id = reaction.emoji.id ?? reaction.emoji.name;
      if (!id) return;

      cache.reactions.cache.get(guildId)?.get(channelId)?.get(msgId)?.set(id, reaction);
    },
    delete: (id, msgId, channelId, guildId) => {
      if (cache.reactions.cache.get(guildId)?.size === 1) {
        if (cache.reactions.cache.get(guildId)?.get(channelId)?.size === 1) {
          if (cache.reactions.cache.get(guildId)?.get(channelId)?.get(msgId)?.size === 1) {
            cache.reactions.cache.delete(guildId);
          } else {
            cache.reactions.cache.get(guildId)?.get(channelId)?.delete(msgId);
          }
        } else {
          cache.reactions.cache.get(guildId)?.get(channelId)?.get(msgId)?.delete(id);
        }
      } else {
        cache.reactions.cache.get(guildId)?.get(channelId)?.get(msgId)?.delete(id);
      }
    },
    cache: new Map(),
  },
  roles: {
    get: async (roleId, guildId) => {
      const cached = cache.roles.cache.get(guildId)?.get(roleId);
      if (cached) return cached;

      const fetched = await client.helpers.getRoles(guildId);
      fetched.forEach((f) => cache.roles.set(f));

      return fetched.find((f) => f.id === roleId);
    },
    set: (role) => {
      if (!cache.roles.cache.get(role.guildId)) cache.roles.cache.set(role.guildId, new Map());
      cache.roles.cache.get(role.guildId)?.set(role.id, role);
    },
    find: (id) =>
      Array.from(cache.roles.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((r) => r.id === id),
    delete: (id) => {
      const cached = cache.roles.find(id);
      if (!cached) return;

      if (cache.roles.cache.get(cached.guildId)?.size === 1) {
        cache.roles.cache.delete(cached.guildId);
      } else {
        cache.roles.cache.get(cached.guildId)?.delete(id);
      }
    },
    cache: new Map(),
  },
  channels: {
    get: async (channelId, guildId) => {
      const cached = cache.channels.cache.get(guildId)?.get(channelId);
      if (cached) return cached;

      const fetched = await client.helpers.getChannels(guildId);
      fetched.forEach((f) => cache.channels.set(f));

      return fetched.find((f) => f.id === channelId);
    },
    set: (channel) => {
      if (!cache.channels.cache.get(channel.guildId)) {
        cache.channels.cache.set(channel.guildId, new Map());
      }
      cache.channels.cache.get(channel.guildId)?.set(channel.id, channel);
    },
    find: (id) =>
      Array.from(cache.channels.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((r) => r.id === id),
    delete: (id) => {
      const cached = cache.roles.find(id);
      if (!cached) return;

      if (cache.roles.cache.get(cached.guildId)?.size === 1) {
        cache.roles.cache.delete(cached.guildId);
      } else {
        cache.roles.cache.get(cached.guildId)?.delete(id);
      }
    },
    cache: new Map(),
  },
  guilds: {
    get: async (guildId) => {
      const cached = cache.guilds.cache.get(guildId);
      if (cached) return cached;

      const fetched = await client.helpers.getGuild(guildId);
      cache.guilds.set(fetched);

      return fetched;
    },
    set: (guild) => {
      cache.guilds.cache.set(guild.id, guild);
    },
    delete: (id) => {
      cache.guilds.cache.delete(id);
    },
    cache: new Map(),
  },
  messages: {
    get: async (id, channelId, guildId) => {
      const cached = cache.messages.cache.get(guildId)?.get(channelId)?.get(id);
      if (cached) return cached;

      const fetched = await client.helpers.getMessage(channelId, id);
      cache.messages.set(fetched);

      return fetched;
    },
    set: (msg) => {
      if (!msg.guildId) return;
      if (!cache.messages.cache.get(msg.guildId)) cache.messages.cache.set(msg.guildId, new Map());
      if (!cache.messages.cache.get(msg.guildId)?.get(msg.channelId)) {
        cache.messages.cache.get(msg.guildId)?.set(msg.channelId, new Map());
      }
      cache.messages.cache.get(msg.guildId)?.get(msg.channelId)?.set(msg.id, msg);
    },
    find: (id) =>
      Array.from(cache.messages.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((c) => c.get(id))
        ?.get(id),
    delete: (id) => {
      const cached = cache.messages.find(id);
      if (!cached || !cached.guildId) return;

      if (cache.messages.cache.get(cached.guildId)?.size === 1) {
        if (cache.messages.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
          cache.messages.cache.get(cached.guildId)?.get(cached.channelId)?.clear();
        } else cache.messages.cache.get(cached.guildId)?.get(cached.channelId)?.delete(cached.id);
      } else if (cache.messages.cache.get(cached.guildId)?.get(cached.channelId)?.size === 1) {
        cache.messages.cache.get(cached.guildId)?.delete(cached.channelId);
      } else {
        cache.messages.cache.get(cached.guildId)?.get(cached.channelId)?.delete(cached.id);
      }
    },
    cache: new Map(),
  },
  stickers: {
    get: async (id, guildId) => {
      const cached = cache.stickers.cache.get(guildId)?.get(id);
      if (cached) return cached;

      const fetched = await client.helpers.getGuildStickers(guildId);
      fetched.forEach((f) => cache.stickers.set(f));

      return fetched.find((f) => f.id === id);
    },
    set: (sticker) => {
      if (!sticker.guildId) return;

      if (!cache.stickers.cache.get(sticker.guildId)) {
        cache.stickers.cache.set(sticker.guildId, new Map());
      }
      cache.stickers.cache.get(sticker.guildId)?.set(sticker.id, sticker);
    },
    find: (id) =>
      Array.from(cache.stickers.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((r) => r.id === id),
    delete: (id) => {
      const cached = cache.stickers.find(id);
      if (!cached || !cached.guildId) return;

      if (cache.stickers.cache.get(cached.guildId)?.size === 1) {
        cache.stickers.cache.delete(cached.guildId);
      } else {
        cache.stickers.cache.get(cached.guildId)?.delete(id);
      }
    },
    cache: new Map(),
  },
  scheduledEvents: {
    get: async (id, guildId) => {
      const cached = cache.scheduledEvents.cache.get(guildId)?.get(id);
      if (cached) return cached;

      const fetched = await client.helpers.getScheduledEvents(guildId, { withUserCount: true });
      fetched.forEach(async (f) => {
        (f as CT.ScheduledEvent).users = await client.ch.getScheduledEventUsers(f.guildId, f);
        cache.scheduledEvents.set(f);
      });

      return fetched.find((f) => f.id === id);
    },
    set: (scheduledEvent) => {
      if (!scheduledEvent.guildId) return;

      if (!cache.scheduledEvents.cache.get(scheduledEvent.guildId)) {
        cache.scheduledEvents.cache.set(scheduledEvent.guildId, new Map());
      }

      cache.scheduledEvents.cache
        .get(scheduledEvent.guildId)
        ?.set(scheduledEvent.id, scheduledEvent);
    },
    find: (id) =>
      Array.from(cache.scheduledEvents.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((r) => r.id === id),
    delete: (id) => {
      const cached = cache.scheduledEvents.find(id);
      if (!cached || !cached.guildId) return;

      if (cache.scheduledEvents.cache.get(cached.guildId)?.size === 1) {
        cache.scheduledEvents.cache.delete(cached.guildId);
      } else {
        cache.scheduledEvents.cache.get(cached.guildId)?.delete(id);
      }
    },
    cache: new Map(),
  },
  stageInstances: {
    get: async (id, guildId) => {
      const cached = cache.stageInstances.cache.get(guildId)?.get(id);
      if (cached) return cached;

      const fetched = await client.helpers.getStageInstance(guildId);
      cache.stageInstances.set(fetched);

      return fetched;
    },
    set: (stageInstance) => {
      if (!stageInstance.guildId) return;

      if (!cache.stageInstances.cache.get(stageInstance.guildId)) {
        cache.stageInstances.cache.set(stageInstance.guildId, new Map());
      }
      cache.stageInstances.cache.get(stageInstance.guildId)?.set(stageInstance.id, stageInstance);
    },
    find: (id) =>
      Array.from(cache.stageInstances.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((r) => r.id === id),
    delete: (id) => {
      const cached = cache.stageInstances.find(id);
      if (!cached || !cached.guildId) return;

      if (cache.stageInstances.cache.get(cached.guildId)?.size === 1) {
        cache.stageInstances.cache.delete(cached.guildId);
      } else {
        cache.stageInstances.cache.get(cached.guildId)?.delete(id);
      }
    },
    cache: new Map(),
  },
  threads: {
    get: async (id, channelId, guildId) => {
      const cached = cache.threads.cache.get(guildId)?.get(channelId)?.get(id);
      if (cached) return cached;

      const fetched = await client.helpers.getChannel(id);

      const members = await client.helpers.getThreadMembers(id);
      (fetched as CT.Thread).members = members
        .map((m) => m.id ?? m.userId)
        .filter((id): id is bigint => !!id);

      cache.threads.set(fetched);

      return fetched;
    },
    set: (thread) => {
      if (!thread.guildId || !thread.parentId) return;
      if (!cache.threads.cache.get(thread.guildId))
        cache.threads.cache.set(thread.guildId, new Map());
      if (!cache.threads.cache.get(thread.guildId)?.get(thread.parentId)) {
        cache.threads.cache.get(thread.guildId)?.set(thread.parentId, new Map());
      }
      cache.threads.cache.get(thread.guildId)?.get(thread.parentId)?.set(thread.id, thread);
    },
    find: (id) =>
      Array.from(cache.threads.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((c) => c.get(id))
        ?.get(id),
    delete: (id) => {
      const cached = cache.threads.find(id);
      if (!cached || !cached.guildId || !cached.parentId) return;

      if (cache.threads.cache.get(cached.guildId)?.size === 1) {
        if (cache.threads.cache.get(cached.guildId)?.get(cached.parentId)?.size === 1) {
          cache.threads.cache.get(cached.guildId)?.get(cached.parentId)?.clear();
        } else cache.threads.cache.get(cached.guildId)?.get(cached.parentId)?.delete(cached.id);
      } else if (cache.threads.cache.get(cached.guildId)?.get(cached.parentId)?.size === 1) {
        cache.threads.cache.get(cached.guildId)?.delete(cached.parentId);
      } else {
        cache.threads.cache.get(cached.guildId)?.get(cached.parentId)?.delete(cached.id);
      }
    },
    cache: new Map(),
  },
  voiceStates: {
    get: async (userId, guildId) => {
      const cached = cache.voiceStates.cache.get(guildId)?.get(userId);
      return cached;
    },
    set: (voiceState) => {
      if (!cache.voiceStates.cache.get(voiceState.guildId)) {
        cache.voiceStates.cache.set(voiceState.guildId, new Map());
      }
      cache.voiceStates.cache.get(voiceState.guildId)?.set(voiceState.userId, voiceState);
    },
    find: (id) =>
      Array.from(cache.voiceStates.cache, ([, g]) => g)
        .map((c) => Array.from(c, ([, i]) => i))
        .flat()
        .find((r) => r.userId === id),
    delete: (id) => {
      const cached = cache.voiceStates.find(id);
      if (!cached || !cached.guildId) return;

      if (cache.voiceStates.cache.get(cached.guildId)?.size === 1) {
        cache.voiceStates.cache.delete(cached.guildId);
      } else {
        cache.voiceStates.cache.get(cached.guildId)?.delete(id);
      }
    },
    cache: new Map(),
  },

  giveawayClaimTimeout: {
    set: (job, guildId, userId) => {
      const cached = cache.giveawayClaimTimeout.cache.get(guildId)?.get(userId);
      cached?.cancel();

      if (!cache.giveawayClaimTimeout.cache.get(guildId)) {
        cache.giveawayClaimTimeout.cache.set(guildId, new Map());
      }
      cache.giveawayClaimTimeout.cache.get(guildId)?.set(userId, job);
    },
    delete: (guildId, userId) => {
      const cached = cache.giveawayClaimTimeout.cache.get(guildId)?.get(userId);
      cached?.cancel();

      if (cache.giveawayClaimTimeout.cache.get(guildId)?.size === 1) {
        cache.giveawayClaimTimeout.cache.delete(guildId);
      } else {
        cache.giveawayClaimTimeout.cache.get(guildId)?.delete(userId);
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
  verificationCodes: {
    set: (code, guildId, userId) => {
      if (!cache.verificationCodes.cache.get(guildId)) {
        cache.verificationCodes.cache.set(guildId, new Map());
      }

      cache.verificationCodes.cache?.get(guildId)?.set(userId, code);
    },
    delete: (guildId, userId) => {
      if (cache.verificationCodes.cache.get(guildId)?.size === 1) {
        cache.verificationCodes.cache.delete(guildId);
      } else {
        cache.verificationCodes.cache.get(guildId)?.delete(userId);
      }
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
};

export default cache;
