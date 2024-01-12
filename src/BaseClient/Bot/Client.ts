import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

const client = new Discord.Client({
 shards: Sharding.getInfo().SHARD_LIST,
 shardCount: Sharding.getInfo().TOTAL_SHARDS,
 allowedMentions: {
  parse: ['users'],
  repliedUser: false,
 },
 partials: [
  Discord.Partials.User,
  Discord.Partials.Channel,
  Discord.Partials.GuildMember,
  Discord.Partials.Message,
  Discord.Partials.Reaction,
  Discord.Partials.GuildScheduledEvent,
  Discord.Partials.ThreadMember,
 ],
 failIfNotExists: false,
 presence: {
  status: Discord.PresenceUpdateStatus.Idle,
  afk: false,
  activities: [
   {
    state: 'Starting up...',
    name: 'Starting up...',
    type: Discord.ActivityType.Custom,
   },
  ],
 },
 intents: [
  Discord.IntentsBitField.Flags.Guilds,
  Discord.IntentsBitField.Flags.GuildMembers,
  Discord.IntentsBitField.Flags.GuildModeration,
  Discord.IntentsBitField.Flags.GuildEmojisAndStickers,
  Discord.IntentsBitField.Flags.GuildIntegrations,
  Discord.IntentsBitField.Flags.GuildWebhooks,
  Discord.IntentsBitField.Flags.GuildInvites,
  Discord.IntentsBitField.Flags.GuildVoiceStates,
  Discord.IntentsBitField.Flags.GuildMessages,
  Discord.IntentsBitField.Flags.GuildMessageReactions,
  Discord.IntentsBitField.Flags.DirectMessages,
  Discord.IntentsBitField.Flags.DirectMessageReactions,
  Discord.IntentsBitField.Flags.MessageContent,
  Discord.IntentsBitField.Flags.GuildScheduledEvents,
  Discord.IntentsBitField.Flags.AutoModerationConfiguration,
  Discord.IntentsBitField.Flags.AutoModerationExecution,
  Discord.IntentsBitField.Flags.GuildMessageTyping,
 ],
 sweepers: {
  messages: {
   interval: 60,
   lifetime: 1_209_600, // 14 days
  },
 },
});

client.cluster = new Sharding.ClusterClient(client);
await client.login(process.env.Token);

export const API = new DiscordCore.API(client.rest);
export default client;
