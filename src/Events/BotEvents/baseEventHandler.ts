import * as Discord from 'discord.js';
import client from '../../BaseClient/Bot/Client.js';
import metricsCollector from '../../BaseClient/Bot/Metrics.js';

export default async (eventName: string, args: unknown[]) => {
 processEvents(eventName, args);
 clusterEvents(eventName, args);
 botEvents(eventName, args);
 restEvents(eventName, args);
};

const botEvents = async (eventName: string, args: unknown[]) => {
 if (Number(client.uptime) > 60000 || process.argv.includes('--dev')) {
  firstGuildInteraction(eventName, args);
  firstChannelInteraction(eventName, args);
  userMiddleware(args);
 }

 const event = client.util.getEvents.BotEvents.find((e) => e.endsWith(`${eventName}.js`));
 if (!event) return;

 (await import(event)).default(...args);
};

const clusterEvents = async (eventName: string, args: unknown[]) => {
 const event = client.util.getEvents.ClusterEvents.find((e) => e.endsWith(`${eventName}.js`));
 if (!event) return;

 (await import(event)).default(...args);
};

const processEvents = async (eventName: string, args: unknown[]) => {
 const event = client.util.getEvents.ProcessEvents.find((e) => e.endsWith(`${eventName}.js`));
 if (!event) return;

 (await import(event)).default(...args);
};

const restEvents = async (eventName: string, args: unknown[]) => {
 const event = client.util.getEvents.RestEvents.find((e) => e.endsWith(`${eventName}.js`));
 if (!event) return;

 (await import(event)).default(...args);
};

const ignoreEvents = [
 Discord.Events.Debug,
 Discord.Events.CacheSweep,
 Discord.Events.ClientReady,
 Discord.Events.Error,
 Discord.Events.Invalidated,
 Discord.Events.Raw,
 Discord.Events.PresenceUpdate,
 Discord.Events.ShardDisconnect,
 Discord.Events.ShardError,
 Discord.Events.ShardReady,
 Discord.Events.ShardReconnecting,
 Discord.Events.ShardResume,
 Discord.Events.Warn,
];

const firstGuildInteraction = (eventName: string, args: unknown[]) => {
 if (ignoreEvents.includes(eventName)) {
  metricsCollector.shardEventsReceived('Ayako - Manager', eventName, client.cluster?.id ?? 0);

  return;
 }

 switch (true) {
  case typeof args[0] === 'object' && args[0] && args[0] instanceof Discord.Guild: {
   client.util.firstGuildInteraction(args[0] as Discord.Guild, eventName);
   break;
  }
  case typeof args[1] === 'object' && args[1] && args[1] instanceof Discord.Guild: {
   client.util.firstGuildInteraction(args[1] as Discord.Guild, eventName);
   break;
  }
  case typeof args[0] === 'object' &&
   args[0] &&
   'guild' in (args[0] as Record<'guild', Discord.Guild>): {
   client.util.firstGuildInteraction(
    (args[0] as Record<'guild', Discord.Guild>).guild as Discord.Guild,
    eventName,
   );
   break;
  }
  case typeof args[1] === 'object' &&
   args[1] &&
   'guild' in (args[1] as Record<'guild', Discord.Guild>): {
   client.util.firstGuildInteraction(
    (args[1] as Record<'guild', Discord.Guild>).guild as Discord.Guild,
    eventName,
   );
   break;
  }
  default: {
   break;
  }
 }
};

const firstChannelInteraction = (eventName: string, args: unknown[]) => {
 if (ignoreEvents.includes(eventName)) return;

 switch (true) {
  case typeof args[0] === 'object' && args[0] && args[0] instanceof Discord.GuildChannel: {
   client.util.firstChannelInteraction(args[0] as Discord.GuildChannel);
   break;
  }
  case typeof args[1] === 'object' && args[1] && args[1] instanceof Discord.GuildChannel: {
   client.util.firstChannelInteraction(args[1] as Discord.GuildChannel);
   break;
  }
  case typeof args[0] === 'object' &&
   args[0] &&
   'channel' in (args[0] as Record<'channel', Discord.GuildChannel>): {
   client.util.firstChannelInteraction(
    (args[0] as Record<'channel', Discord.GuildChannel>).channel as Discord.GuildChannel,
   );
   break;
  }
  case typeof args[1] === 'object' &&
   args[1] &&
   'channel' in (args[1] as Record<'channel', Discord.GuildChannel>): {
   client.util.firstChannelInteraction(
    (args[1] as Record<'channel', Discord.GuildChannel>).channel as Discord.GuildChannel,
   );
   break;
  }
  default: {
   break;
  }
 }
};

const userMiddleware = (args: unknown[]) => {
 if (!args[0]) return;
 if (typeof args[0] !== 'object') return;

 client.util.userMiddleware(args);
};
