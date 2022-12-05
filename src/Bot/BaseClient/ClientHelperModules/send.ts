import type DDeno from 'discordeno';
import jobs from 'node-schedule';
import type CT from '../../Typings/CustomTypings';
import client from '../DDenoClient.js';

async function send(
  c: DDeno.Channel,
  payload: CT.CreateMessage,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<DDeno.Message | null | void>;
async function send(
  c: { id: bigint; guildId: bigint },
  payload: CT.CreateMessage,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<DDeno.Message | null | void>;
async function send(
  c: DDeno.Channel[],
  payload: CT.CreateMessage,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<(DDeno.Message | null | void)[] | null | void>;
async function send(
  c: { id: bigint[]; guildId: bigint },
  payload: CT.CreateMessage,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<(DDeno.Message | null | void)[] | null | void>;
async function send(
  c:
    | DDeno.Channel
    | DDeno.Channel[]
    | { id: bigint[]; guildId: bigint }
    | { id: bigint; guildId: bigint },
  payload: CT.CreateMessage,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<DDeno.Message | (DDeno.Message | null | void)[] | null | void> {
  if (!c) return null;

  if (Array.isArray(c)) {
    const sentMessages = await Promise.all(
      c.map((ch) => send(ch, payload, language, command, timeout)),
    );
    return sentMessages;
  }

  if (Array.isArray(c.id)) {
    const sentMessages = await Promise.all(
      c.id.map((id) => send(id as unknown as DDeno.Channel, payload, language, command, timeout)),
    );
    return sentMessages;
  }

  const channel = !('name' in c) ? await client.cache.channels.get(c.id, c.guildId) : c;
  if (!channel) return null;

  if (timeout) {
    combineMessages(channel, payload, timeout, language);
    return null;
  }

  const files = Array.from(payload.files ?? []);
  delete payload.files;
  const ddenoPayload = payload as DDeno.CreateMessage;
  ddenoPayload.file = files;

  const sentMessage = await client.helpers.sendMessage(channel.id, ddenoPayload).catch((err) => {
    // eslint-disable-next-line no-console
    console.log('send err', err);
  });

  return sentMessage;
}

export default send;

const combineMessages = async (
  channel: DDeno.Channel,
  payload: CT.CreateMessage,
  timeout: number,
  language: CT.Language,
) => {
  if (![0, 1, 2, 3, 5, 10, 11, 12].includes(channel.type)) return;

  if (!payload.embeds?.length || (!payload.embeds?.length && !payload.files?.length)) {
    send(channel, payload, language);
    return;
  }

  if (!client.channelQueue.has(channel.id)) {
    client.channelQueue.set(channel.id, [payload]);
    client.channelCharLimit.set(channel.id, getEmbedCharLens(payload.embeds));
    client.channelTimeout.get(channel.id)?.cancel();

    queueSend(channel, timeout, language);
    return;
  }

  const updatedQueue = client.channelQueue.get(channel.id);
  const charsToPush = getEmbedCharLens(payload.embeds);
  const charLimit = client.channelCharLimit.get(channel.id);

  if (updatedQueue && updatedQueue.length < 10 && charLimit && charLimit + charsToPush <= 5000) {
    updatedQueue.push(payload);
    client.channelCharLimit.set(channel.id, charLimit + charsToPush);
    client.channelQueue.set(channel.id, updatedQueue);

    client.channelTimeout.get(channel.id)?.cancel();

    queueSend(channel, timeout, language);
    return;
  }

  if (
    updatedQueue &&
    (updatedQueue.length === 10 || (charLimit && charLimit + charsToPush >= 5000))
  ) {
    const embeds =
      updatedQueue
        .map((p: CT.CreateMessage) => p.embeds)
        .flat(1)
        .filter((e): e is DDeno.Embed => !!e) || [];
    send(channel, { embeds }, language);

    client.channelQueue.set(channel.id, [payload]);
    client.channelTimeout.get(channel.id)?.cancel();
    client.channelCharLimit.set(channel.id, getEmbedCharLens(payload.embeds));

    queueSend(channel, timeout, language);
  }
};

const getEmbedCharLens = (embeds: DDeno.Embed[]) => {
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
  return total > 6000 ? 1000 : total;
};

const queueSend = async (channel: DDeno.Channel, timeout: number, language: CT.Language) => {
  if (![0, 1, 2, 3, 5, 10, 11, 12].includes(channel.type)) return;

  client.channelTimeout.set(
    channel.id,
    jobs.scheduleJob(new Date(Date.now() + timeout), () => {
      send(
        channel,
        {
          embeds: client.channelQueue
            .get(channel.id)
            ?.map((p) => (p.embeds && p.embeds.length ? p.embeds : []))
            ?.flat(1)
            .filter((e) => !!e),
          files: client.channelQueue
            .get(channel.id)
            ?.map((p) => (p.files && p.files.length ? p.files : []))
            ?.flat(1)
            .filter((f) => !!f),
        },
        language,
      );

      client.channelQueue.delete(channel.id);
      client.channelTimeout.delete(channel.id);
      client.channelCharLimit.delete(channel.id);
    }),
  );
};
