import type * as Discord from 'discord.js';
import Jobs from 'node-schedule';
import type CT from '../../Typings/CustomTypings';

interface MessageCreateOptions extends Omit<Discord.MessageCreateOptions, 'embeds'> {
  embeds?: Discord.APIEmbed[];
}

async function send(
  c: Discord.TextBasedChannel[],
  payload: MessageCreateOptions,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<(Discord.Message | null | void)[] | null | void>;
async function send(
  c: { id: string[]; guildId: string },
  payload: MessageCreateOptions,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<(Discord.Message | null | void)[] | null | void>;
async function send(
  c: Discord.TextBasedChannel,
  payload: MessageCreateOptions,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<Discord.Message | null | void>;
async function send(
  c: { id: string; guildId: string },
  payload: MessageCreateOptions,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<Discord.Message | null | void>;
async function send(
  c:
    | Discord.TextBasedChannel
    | Discord.TextBasedChannel[]
    | { id: string[]; guildId: string }
    | { id: string; guildId: string },
  payload: MessageCreateOptions,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<Discord.Message | (Discord.Message | null | void)[] | null | void> {
  if (!c) return null;

  if (Array.isArray(c)) {
    const sentMessages = await Promise.all(
      c.map((ch) => send(ch, payload, language, command, timeout)),
    );
    return sentMessages;
  }

  const client = (await import('../Client.js')).default;

  if (Array.isArray(c.id)) {
    const sentMessages = await Promise.all(
      c.id.map((id) =>
        send(
          client.channels.cache.get(id) as unknown as Discord.TextBasedChannel,
          payload,
          language,
          command,
          timeout,
        ),
      ),
    );
    return sentMessages;
  }

  if (payload.files?.length) timeout = undefined;
  if (Number(payload.embeds?.length) > 1) timeout = undefined;
  if (payload.components?.length) timeout = undefined;
  if (payload.content?.length) timeout = undefined;

  const channel = !('name' in c) ? client.channels.cache.get(c.id) : c;
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

  payload.embeds?.forEach((e) => {
    if (e.author && !e.author.url) {
      e.author.url = client.customConstants.standard.invite;
    }

    e.fields?.forEach((f) => {
      if (typeof f.inline !== 'boolean') {
        f.inline = true;
      }
    });
  });

  if (timeout && 'guild' in channel && payload.embeds?.length) {
    combineMessages(channel, payload.embeds, timeout, language);
    return null;
  }

  payload.embeds?.forEach((p) => {
    p.fields?.forEach((p) => {
      p.value?.length > 1024 ? console.log(p) : null;
    });
  });

  const sentMessage = await channel.send(payload).catch((err) => {
    // eslint-disable-next-line no-console
    console.log('send err', err);
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
  language: CT.Language,
) => {
  const client = (await import('../Client.js')).default;

  let guildQueue = client.channelQueue.get(channel.guildId);
  if (!guildQueue) {
    client.channelQueue.set(channel.guildId, new Map());
    guildQueue = client.channelQueue.get(channel.guildId);
  }

  if (!guildQueue) {
    send(channel, { embeds }, language);
    return;
  }

  let channelQueue = guildQueue.get(channel.id);
  if (!channelQueue) {
    guildQueue.set(channel.id, []);
    channelQueue = guildQueue.get(channel.id);
  }

  if (!channelQueue) {
    send(channel, { embeds }, language);
    return;
  }

  if (
    Number(channelQueue.length) + embeds.length > 10 ||
    getEmbedCharLens([...channelQueue, ...embeds]) > 6000
  ) {
    client.channelTimeout.get(channel.guildId)?.get(channel.id)?.cancel();
    send(channel, { embeds: channelQueue }, language);
    guildQueue.set(channel.id, []);
    channelQueue = guildQueue.get(channel.id);
  }

  if (!channelQueue) {
    send(channel, { embeds }, language);
    return;
  }

  client.channelQueue
    .get(channel.guildId)
    ?.get(channel.id)
    ?.push(...embeds);

  if (client.channelTimeout.get(channel.guildId)?.get(channel.id)) return;

  let timeoutGuild = client.channelTimeout.get(channel.guildId);
  if (!timeoutGuild) {
    client.channelTimeout.set(channel.guildId, new Map());
    timeoutGuild = client.channelTimeout.get(channel.guildId);
  }

  if (!timeoutGuild) {
    send(channel, { embeds }, language);
    return;
  }

  timeoutGuild.set(
    channel.guildId,
    Jobs.scheduleJob(new Date(Date.now() + timeout), () => {
      const queuedEmbeds = client.channelQueue.get(channel.guildId)?.get(channel.id) || [];
      send(channel, { embeds: queuedEmbeds }, language);

      client.channelQueue.get(channel.guildId)?.delete(channel.id);
      client.channelTimeout.get(channel.guildId)?.delete(channel.id);

      if (client.channelQueue.get(channel.guildId)?.size === 0) {
        client.channelQueue.delete(channel.guildId);
      }
      if (client.channelTimeout.get(channel.guildId)?.size === 0) {
        client.channelTimeout.delete(channel.guildId);
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
