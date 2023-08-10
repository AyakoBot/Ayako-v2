import type * as Discord from 'discord.js';
import Jobs from 'node-schedule';
import type CT from '../../Typings/CustomTypings.js';

// eslint-disable-next-line no-console
const { log } = console;

export interface MessageCreateOptions extends Omit<Discord.MessageCreateOptions, 'embeds'> {
 embeds?: Discord.APIEmbed[];
}

type ChannelTypes =
 | Discord.TextChannel
 | Discord.TextBasedChannel
 | Discord.BaseGuildTextChannel
 | Discord.BaseGuildVoiceChannel;

async function send(
 channels: Discord.User | CT.bEvalUser,
 payload: MessageCreateOptions,
 command?: CT.Command,
 timeout?: number,
): Promise<(Discord.Message | null | void)[] | null | void>;
async function send(
 channels: ChannelTypes[],
 payload: MessageCreateOptions,
 command?: CT.Command,
 timeout?: number,
): Promise<(Discord.Message | null | void)[] | null | void>;
async function send(
 channels: { id: string; guildId: string },
 payload: MessageCreateOptions,
 command?: CT.Command,
 timeout?: number,
): Promise<Discord.Message | null | void>;
async function send(
 channels: { id: string[]; guildId: string },
 payload: MessageCreateOptions,
 command?: CT.Command,
 timeout?: number,
): Promise<(Discord.Message | null | void)[] | null | void>;
async function send(
 channels: ChannelTypes,
 payload: MessageCreateOptions,
 command?: CT.Command,
 timeout?: number,
): Promise<Discord.Message | null | void>;
async function send(
 channels:
  | ChannelTypes
  | ChannelTypes[]
  | { id: string[]; guildId: string }
  | { id: string; guildId: string }
  | Discord.User
  | CT.bEvalUser,
 payload: MessageCreateOptions,
 command?: CT.Command,
 timeout?: number,
): Promise<Discord.Message | (Discord.Message | null | void)[] | null | void> {
 if (!channels) return null;

 if (Array.isArray(channels)) {
  const sentMessages = await Promise.all(channels.map((ch) => send(ch, payload, command, timeout)));
  return sentMessages;
 }

 if (Array.isArray(channels.id)) {
  const sentMessages = await Promise.all(
   channels.id.map((id) =>
    send({ id, guildId: (channels as Discord.TextChannel).guildId }, payload, command, timeout),
   ),
  );
  return sentMessages;
 }

 if (payload.files?.length) timeout = undefined;
 if (Number(payload.embeds?.length) > 1) timeout = undefined;
 if (payload.components?.length) timeout = undefined;
 if (payload.content?.length) timeout = undefined;

 const channel = await getChannel(channels as CT.Argument<typeof getChannel, 0>);
 if (!channel) return null;

 if (!('send' in channel)) return null;

 if (
  !payload.content?.length &&
  !payload.embeds?.length &&
  !payload.files?.length &&
  !payload.components?.length
 ) {
  return null;
 }

 const constants = (await import(`${process.cwd()}/BaseClient/Other/constants.js`)).default;
 payload.embeds?.forEach((e) => {
  if (e.author && !e.author.url) e.author.url = constants.standard.invite;

  e.fields?.forEach((f) => {
   if (typeof f.inline !== 'boolean') {
    f.inline = true;
   }
  });
 });

 if (timeout && 'guild' in channel && payload.embeds?.length) {
  combineMessages(channel as Discord.TextChannel, payload.embeds, timeout);
  return null;
 }

 payload.embeds?.forEach((p) => {
  p.fields?.forEach((pa) => (pa.value?.length > 1024 ? log(p) : null));
 });

 const sentMessage = await channel.send(payload).catch((err) => {
  log(JSON.stringify(payload));
  throw new Error(`Send Error: ${err}`);
 });

 return sentMessage;
}

export default send;

const combineMessages = async (
 channel:
  | Discord.AnyThreadChannel<boolean>
  | Discord.NewsChannel
  | Discord.TextChannel
  | Discord.VoiceChannel,
 embeds: Discord.APIEmbed[],
 timeout: number,
) => {
 const ch = (await import(
  `${process.cwd()}/BaseClient/ClientHelper.js`
 )) as typeof import('../ClientHelper.js');

 let guildQueue = ch.channelQueue.get(channel.guildId);
 if (!guildQueue) {
  ch.channelQueue.set(channel.guildId, new Map());
  guildQueue = ch.channelQueue.get(channel.guildId);
 }

 if (!guildQueue) {
  ch.send(channel, { embeds });
  return;
 }

 let channelQueues = guildQueue.get(channel.id);
 if (!channelQueues) {
  guildQueue.set(channel.id, []);
  channelQueues = guildQueue.get(channel.id);
 }

 if (!channelQueues) {
  ch.send(channel, { embeds });
  return;
 }

 if (
  Number(channelQueues.length) + embeds.length > 10 ||
  getEmbedCharLens([...channelQueues, ...embeds]) > 6000
 ) {
  ch.channelTimeout.get(channel.guildId)?.get(channel.id)?.cancel();
  ch.send(channel, { embeds: channelQueues });
  guildQueue.set(channel.id, []);
  channelQueues = guildQueue.get(channel.id);
 }

 if (!channelQueues) {
  ch.send(channel, { embeds });
  return;
 }

 ch.channelQueue
  .get(channel.guildId)
  ?.get(channel.id)
  ?.push(...embeds);

 if (ch.channelTimeout.get(channel.guildId)?.get(channel.id)) return;

 let timeoutGuild = ch.channelTimeout.get(channel.guildId);
 if (!timeoutGuild) {
  ch.channelTimeout.set(channel.guildId, new Map());
  timeoutGuild = ch.channelTimeout.get(channel.guildId);
 }

 if (!timeoutGuild) {
  ch.send(channel, { embeds });
  return;
 }

 timeoutGuild.set(
  channel.guildId,
  Jobs.scheduleJob(new Date(Date.now() + timeout), () => {
   const queuedEmbeds = ch.channelQueue.get(channel.guildId)?.get(channel.id) || [];
   ch.send(channel, { embeds: queuedEmbeds });

   ch.channelQueue.get(channel.guildId)?.delete(channel.id);
   ch.channelTimeout.get(channel.guildId)?.delete(channel.id);

   if (ch.channelQueue.get(channel.guildId)?.size === 0) {
    ch.channelQueue.delete(channel.guildId);
   }
   if (ch.channelTimeout.get(channel.guildId)?.size === 0) {
    ch.channelTimeout.delete(channel.guildId);
   }
  }),
 );
};

const getEmbedCharLens = (embeds: Discord.APIEmbed[]) => {
 let total = 0;
 embeds.forEach((embed) => {
  Object.values(embed).forEach((data) => {
   if (typeof data === 'string') {
    total += data.length;
   }
  });

  for (let i = 0; i < (embed.fields ? embed.fields.length : 0); i += 1) {
   const field = embed.fields ? embed.fields[i] : null;

   if (!field) return;

   if (typeof field.name === 'string') total += field.name.length;
   if (typeof field.value === 'string') total += field.value.length;
  }
 });
 return total;
};

const getChannel = async (
 channels:
  | Discord.User
  | CT.bEvalUser
  | ChannelTypes
  | {
     id: string;
     guildId: string;
    },
) => {
 const { default: client, UsersAPI } = await import('../Client.js');

 if ('username' in channels) return UsersAPI.createDM(channels.id);
 return !('name' in channels) ? client.channels.cache.get(channels.id) : channels;
};
