import { getInfo } from 'discord-hybrid-sharding';
import type {
 ApplicationCommand,
 AutoModerationRule,
 Client,
 Guild,
 GuildBan,
 GuildBasedChannel,
 GuildEmoji,
 GuildMember,
 GuildScheduledEvent,
 Invite,
 Role,
 StageInstance,
 Sticker,
 User,
 VoiceState,
} from 'discord.js';
import Redis from './Redis.js';

const prefix = `${process.env.mainId}:cache:${process.argv.includes('--dev') ? 'dev' : getInfo().CLUSTER}`;

const middleware = {
 channelSet: (data: GuildBasedChannel) =>
  Redis.set(`${prefix}:${data.guildId}:channels:${data.id}`, JSON.stringify(data.toJSON())),
 channelDel: (id: string) => Redis.del(`${prefix}:*:channels:${id}`),
 channel: (client: Client) => {
  const channelSet = client.channels.cache.set;
  client.channels.cache.set = (id, channel) => {
   if (!channel.isDMBased()) middleware.channelSet(channel);
   return channelSet.call(client.channels.cache, id, channel);
  };

  const channelDel = client.channels.cache.delete;
  client.channels.cache.delete = (id) => {
   middleware.channelDel(id);
   return channelDel.call(client.channels.cache, id);
  };
 },

 userSet: (data: User) => Redis.set(`${prefix}:users:${data.id}`, JSON.stringify(data.toJSON())),
 userDel: (id: string) => Redis.del(`${prefix}:users:${id}`),
 user: (client: Client) => {
  const userSet = client.users.cache.set;
  client.users.cache.set = (id, user) => {
   middleware.userSet(user);
   return userSet.call(client.users.cache, id, user);
  };

  const userDel = client.users.cache.delete;
  client.users.cache.delete = (id) => {
   middleware.userDel(id);
   return userDel.call(client.users.cache, id);
  };
 },

 guildSet: (data: Guild) => Redis.set(`${prefix}:guilds:${data.id}`, JSON.stringify(data.toJSON())),
 guildDel: (id: string) => Redis.del(`${prefix}:guilds:${id}`),
 guild: (client: Client) => {
  const guildSet = client.guilds.cache.set;
  client.guilds.cache.set = (id, guild) => {
   if (!guild.name) guild.name = 'Unknown Guild';

   applyGuildMiddleware(guild);
   middleware.guildSet(guild);
   return guildSet.call(client.guilds.cache, id, guild);
  };

  const guildDel = client.guilds.cache.delete;
  client.guilds.cache.delete = (id) => {
   middleware.guildDel(id);
   return guildDel.call(client.guilds.cache, id);
  };
 },

 emojiSet: (data: GuildEmoji) =>
  Redis.set(`${prefix}:${data.guild.id}:emojis:${data.id}`, JSON.stringify(data.toJSON())),
 emojiDel: (id: string) => Redis.del(`${prefix}:*:emojis:${id}`),
 emoji: (client: Client) => {
  const emojiSet = client.emojis.cache.set;
  client.emojis.cache.set = (id, emoji) => {
   middleware.emojiSet(emoji);
   return emojiSet.call(client.emojis.cache, id, emoji);
  };

  const emojiDel = client.emojis.cache.delete;
  client.emojis.cache.delete = (id) => {
   middleware.emojiDel(id);
   return emojiDel.call(client.emojis.cache, id);
  };
 },
};

const guildMiddleware = {
 channel: (g: Guild) => {
  if (!g.channels) return;

  const channelSetG = g.channels.cache.set;
  g.channels.cache.set = (id, channel) => {
   middleware.channelSet(channel);
   return channelSetG.call(g.channels.cache, id, channel);
  };

  const channelDelG = g.channels.cache.delete;
  g.channels.cache.delete = (id) => {
   middleware.channelDel(id);
   return channelDelG.call(g.channels.cache, id);
  };
 },

 emoji: (g: Guild) => {
  if (!g.emojis) return;

  const emojiSetG = g.emojis.cache.set;
  g.emojis.cache.set = (id, emoji) => {
   middleware.emojiSet(emoji);
   return emojiSetG.call(g.emojis.cache, id, emoji);
  };

  const emojiDelG = g.emojis.cache.delete;
  g.emojis.cache.delete = (id) => {
   middleware.emojiDel(id);
   return emojiDelG.call(g.emojis.cache, id);
  };
 },

 stickerSet: (data: Sticker) =>
  Redis.set(
   `${prefix}:${data.guild?.id || '0'}:stickers:${data.id}`,
   JSON.stringify(data.toJSON()),
  ),
 stickerDel: (gId: string | null, id: string) =>
  Redis.del(`${prefix}:${gId || '0'}:stickers:${id}`),
 stickers: (g: Guild) => {
  if (!g.stickers) return;

  const stickerSet = g.stickers.cache.set;
  g.stickers.cache.set = (id, data) => {
   guildMiddleware.stickerSet(data);
   return stickerSet.call(g.stickers.cache, id, data);
  };

  const stickerDel = g.stickers.cache.delete;
  g.stickers.cache.delete = (id) => {
   guildMiddleware.stickerDel(g.id, id);
   return stickerDel.call(g.stickers.cache, id);
  };
 },

 stageSet: (data: StageInstance) =>
  Redis.set(`${prefix}:${data.guild?.id || '0'}:stages:${data.id}`, JSON.stringify(data.toJSON())),
 stageDel: (gId: string | null, id: string) => Redis.del(`${prefix}:${gId || '0'}:stages:${id}`),
 stages: (g: Guild) => {
  if (!g.stageInstances) return;

  const stageSet = g.stageInstances.cache.set;
  g.stageInstances.cache.set = (id, data) => {
   guildMiddleware.stageSet(data);
   return stageSet.call(g.stageInstances.cache, id, data);
  };

  const stageDel = g.stageInstances.cache.delete;
  g.stageInstances.cache.delete = (id) => {
   guildMiddleware.stageDel(g.id, id);
   return stageDel.call(g.stageInstances.cache, id);
  };
 },

 roleSet: (data: Role) =>
  Redis.set(`${prefix}:${data.guild.id}:roles:${data.id}`, JSON.stringify(data.toJSON())),
 roleDel: (gId: string, id: string) => Redis.del(`${prefix}:${gId}:roles:${id}`),
 role: (g: Guild) => {
  if (!g.roles) return;

  const roleSet = g.roles.cache.set;
  g.roles.cache.set = (id, role) => {
   guildMiddleware.roleSet(role);
   return roleSet.call(g.roles.cache, id, role);
  };

  const roleDel = g.roles.cache.delete;
  g.roles.cache.delete = (id) => {
   guildMiddleware.roleDel(g.id, id);
   return roleDel.call(g.roles.cache, id);
  };
 },

 voiceSet: (data: VoiceState) =>
  Redis.set(`${prefix}:${data.guild.id}:voices:${data.id}`, JSON.stringify(data.toJSON())),
 voiceDel: (gId: string, id: string) => Redis.del(`${prefix}:${gId}:voices:${id}`),
 voice: (g: Guild) => {
  if (!g.voiceStates) return;

  const voiceSet = g.voiceStates.cache.set;
  g.voiceStates.cache.set = (id, voice) => {
   guildMiddleware.voiceSet(voice);
   return voiceSet.call(g.voiceStates.cache, id, voice);
  };

  const voiceDel = g.voiceStates.cache.delete;
  g.voiceStates.cache.delete = (id) => {
   guildMiddleware.voiceDel(g.id, id);
   return voiceDel.call(g.voiceStates.cache, id);
  };
 },

 commandSet: (data: ApplicationCommand<0>) =>
  Redis.set(`${prefix}:${data.guildId}:commands:${data.id}`, JSON.stringify(data.toJSON())),
 commandDel: (gId: string, id: string) => Redis.del(`${prefix}:${gId}:commands:${id}`),
 commands: (g: Guild) => {
  if (!g.commands) return;

  const commandSet = g.commands.cache.set;
  g.commands.cache.set = (id, command) => {
   guildMiddleware.commandSet(command);
   return commandSet.call(g.commands.cache, id, command);
  };

  const commandDel = g.commands.cache.delete;
  g.commands.cache.delete = (id) => {
   guildMiddleware.commandDel(g.id, id);
   return commandDel.call(g.commands.cache, id);
  };
 },

 automodSet: (data: AutoModerationRule) =>
  Redis.set(`${prefix}:${data.guild.id}:automod:${data.id}`, JSON.stringify(data.toJSON())),
 automodDel: (gId: string, id: string) => Redis.del(`${prefix}:${gId}:automod:${id}`),
 automods: (g: Guild) => {
  if (!g.autoModerationRules) return;

  const automodSet = g.autoModerationRules.cache.set;
  g.autoModerationRules.cache.set = (id, data) => {
   guildMiddleware.automodSet(data);
   return automodSet.call(g.autoModerationRules.cache, id, data);
  };

  const automodDel = g.autoModerationRules.cache.delete;
  g.autoModerationRules.cache.delete = (id) => {
   guildMiddleware.automodDel(g.id, id);
   return automodDel.call(g.autoModerationRules.cache, id);
  };
 },

 banSet: (data: GuildBan) =>
  Redis.set(`${prefix}:${data.guild.id}:bans:${data.user.id}`, JSON.stringify(data.toJSON())),
 banDel: (gId: string, id: string) => Redis.del(`${prefix}:${gId}:bans:${id}`),
 bans: (g: Guild) => {
  if (!g.bans) return;

  const banSet = g.bans.cache.set;
  g.bans.cache.set = (id, data) => {
   guildMiddleware.banSet(data);
   return banSet.call(g.bans.cache, id, data);
  };

  const banDel = g.bans.cache.delete;
  g.bans.cache.delete = (id) => {
   guildMiddleware.banDel(g.id, id);
   return banDel.call(g.bans.cache, id);
  };
 },

 inviteSet: (data: Invite) =>
  Redis.set(
   `${prefix}:${data.guild?.id || '0'}:invites:${data.code}`,
   JSON.stringify(data.toJSON()),
  ),
 inviteDel: (gId: string | null, code: string) =>
  Redis.del(`${prefix}:${gId || '0'}:invites:${code}`),
 invites: (g: Guild) => {
  if (!g.invites) return;

  const inviteSet = g.invites.cache.set;
  g.invites.cache.set = (code, data) => {
   guildMiddleware.inviteSet(data);
   return inviteSet.call(g.invites.cache, code, data);
  };

  const inviteDel = g.invites.cache.delete;
  g.invites.cache.delete = (code) => {
   guildMiddleware.inviteDel(g.id, code);
   return inviteDel.call(g.invites.cache, code);
  };
 },

 memberSet: (data: GuildMember) =>
  Redis.set(`${prefix}:${data.guild.id}:members:${data.id}`, JSON.stringify(data.toJSON())),
 memberDel: (gId: string, id: string) => Redis.del(`${prefix}:${gId}:members:${id}`),
 members: (g: Guild) => {
  if (!g.members) return;

  const memberSet = g.members.cache.set;
  g.members.cache.set = (id, data) => {
   guildMiddleware.memberSet(data);
   return memberSet.call(g.members.cache, id, data);
  };

  const memberDel = g.members.cache.delete;
  g.members.cache.delete = (id) => {
   guildMiddleware.memberDel(g.id, id);
   return memberDel.call(g.members.cache, id);
  };
 },

 eventSet: (data: GuildScheduledEvent) =>
  Redis.set(`${prefix}:${data.guild?.id || '0'}:events:${data.id}`, JSON.stringify(data.toJSON())),
 eventDel: (gId: string | null, id: string) => Redis.del(`${prefix}:${gId || '0'}:events:${id}`),
 events: (g: Guild) => {
  if (!g.scheduledEvents) return;

  const eventSet = g.scheduledEvents.cache.set;
  g.scheduledEvents.cache.set = (id, data) => {
   guildMiddleware.eventSet(data);
   return eventSet.call(g.scheduledEvents.cache, id, data);
  };

  const eventDel = g.scheduledEvents.cache.delete;
  g.scheduledEvents.cache.delete = (id) => {
   guildMiddleware.eventDel(g.id, id);
   return eventDel.call(g.scheduledEvents.cache, id);
  };
 },
};

export default async (client: Client) => {
 await Redis.del(`${prefix}:*`);

 middleware.channel(client);
 middleware.user(client);
 middleware.guild(client);
 middleware.emoji(client);
};

const applyGuildMiddleware = (guild: Guild) => {
 guildMiddleware.channel(guild);
 guildMiddleware.emoji(guild);
 guildMiddleware.stickers(guild);
 guildMiddleware.stages(guild);
 guildMiddleware.role(guild);
 guildMiddleware.voice(guild);
 guildMiddleware.commands(guild);
 guildMiddleware.automods(guild);
 guildMiddleware.bans(guild);
 guildMiddleware.invites(guild);
 guildMiddleware.members(guild);
 guildMiddleware.events(guild);
};
