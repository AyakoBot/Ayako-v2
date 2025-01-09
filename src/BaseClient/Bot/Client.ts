import * as DiscordCore from '@discordjs/core';
import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';

const client = new Discord.Client({
 shards: Sharding.getInfo().SHARD_LIST,
 shardCount: Sharding.getInfo().TOTAL_SHARDS,
 rest: { api: 'http://nirn:8080/api' },
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
 intents: [
  Discord.IntentsBitField.Flags.Guilds,
  Discord.IntentsBitField.Flags.GuildMembers,
  Discord.IntentsBitField.Flags.GuildModeration,
  Discord.IntentsBitField.Flags.GuildExpressions,
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
 presence: {
  status: Discord.PresenceUpdateStatus.Idle,
  afk: true,
  activities: [
   {
    state: 'Starting up...',
    name: 'Starting up...',
    type: Discord.ActivityType.Custom,
   },
  ],
 },
});

client.cluster = new Sharding.ClusterClient(client);

await client.login(
 (process.argv.includes('--dev') ? process.env.DevToken : process.env.Token) ?? '',
);

export const API = new DiscordCore.API(client.rest);
export default client;
