import type * as Discord from 'discord.js';
import jobs from 'node-schedule';
import type CT from '../../Typings/CustomTypings';

async function send(
  c: Discord.Channel,
  payload: Discord.MessageCreateOptions,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<Discord.Message | null | void>;
async function send(
  c: { id: string; guildId: string },
  payload: Discord.MessageCreateOptions,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<Discord.Message | null | void>;
async function send(
  c: Discord.Channel[],
  payload: Discord.MessageCreateOptions,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<(Discord.Message | null | void)[] | null | void>;
async function send(
  c: { id: string[]; guildId: string },
  payload: Discord.MessageCreateOptions,
  language: CT.Language,
  command?: CT.Command,
  timeout?: number,
): Promise<(Discord.Message | null | void)[] | null | void>;
async function send(
  c:
    | Discord.Channel
    | Discord.Channel[]
    | { id: string[]; guildId: string }
    | { id: string; guildId: string },
  payload: Discord.MessageCreateOptions,
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
          client.channels.cache.get(id) as unknown as Discord.Channel,
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

  const channel = !('name' in c) ? client.channels.cache.get(c.id) : c;
  if (!channel) return null;

  if (!('send' in channel)) return null;

  if (timeout && 'guild' in channel) {
    combineMessages(channel, payload, timeout, language);
    return null;
  }

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
  payload: Discord.MessageCreateOptions,
  timeout: number,
  language: CT.Language,
) => {
  const client = (await import('../Client.js')).default;
  if (!client.channelQueue.get(channel.guild.id)) {
    client.channelQueue.set(channel.guild.id, new Map());
  }

  if (!client.channelCharLimit.get(channel.guild.id)) {
    client.channelCharLimit.set(channel.guild.id, new Map());
  }

  if (!client.channelTimeout.get(channel.guild.id)) {
    client.channelTimeout.set(channel.guild.id, new Map());
  }

  if (![0, 1, 2, 3, 5, 10, 11, 12].includes(channel.type)) return;

  if (!payload.embeds?.length || (!payload.embeds?.length && !payload.files?.length)) {
    send(channel, payload, language);
    return;
  }

  if (!client.channelQueue.has(channel.id)) {
    client.channelQueue.get(channel.guild.id)?.set(channel.id, [payload]);
    client.channelCharLimit
      .get(channel.guild.id)
      ?.set(
        channel.id,
        getEmbedCharLens(payload.embeds.map((e) => ('toJSON' in e ? e.toJSON() : e))),
      );
    client.channelTimeout.get(channel.guild.id)?.get(channel.id)?.cancel();

    queueSend(channel, timeout, language);
    return;
  }

  const updatedQueue = client.channelQueue.get(channel.guild.id)?.get(channel.id);
  const charsToPush = getEmbedCharLens(payload.embeds.map((e) => ('toJSON' in e ? e.toJSON() : e)));
  const charLimit = client.channelCharLimit.get(channel.guild.id)?.get(channel.id);

  if (updatedQueue && updatedQueue.length < 10 && charLimit && charLimit + charsToPush <= 5000) {
    updatedQueue.push(payload);
    client.channelCharLimit.get(channel.guild.id)?.set(channel.id, charLimit + charsToPush);
    client.channelQueue.get(channel.guild.id)?.set(channel.id, updatedQueue);

    client.channelTimeout.get(channel.guild.id)?.get(channel.id)?.cancel();

    queueSend(channel, timeout, language);
    return;
  }

  if (
    updatedQueue &&
    (updatedQueue.length === 10 || (charLimit && charLimit + charsToPush >= 5000))
  ) {
    const embeds =
      updatedQueue
        .map((p: Discord.MessageCreateOptions) => p.embeds)
        .flat(1)
        .filter((e): e is Discord.APIEmbed => !!e) || [];
    send(channel, { embeds }, language);

    client.channelQueue.get(channel.guild.id)?.set(channel.id, [payload]);
    client.channelTimeout.get(channel.guild.id)?.get(channel.id)?.cancel();
    client.channelCharLimit
      .get(channel.guild.id)
      ?.set(
        channel.id,
        getEmbedCharLens(payload.embeds.map((e) => ('toJSON' in e ? e.toJSON() : e))),
      );

    queueSend(channel, timeout, language);
  }
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
  return total > 6000 ? 1000 : total;
};

const queueSend = async (
  channel:
    | Discord.AnyThreadChannel<boolean>
    | Discord.NewsChannel
    | Discord.TextChannel
    | Discord.VoiceChannel,
  timeout: number,
  language: CT.Language,
) => {
  if (![0, 1, 2, 3, 5, 10, 11, 12].includes(channel.type)) return;
  const client = (await import('../Client.js')).default;

  const guildMap = client.channelTimeout.get(channel.guild.id) ?? new Map();
  guildMap.set(
    channel.id,
    jobs.scheduleJob(new Date(Date.now() + timeout), () => {
      send(
        channel,
        {
          embeds: client.channelQueue
            .get(channel.guild.id)
            ?.get(channel.id)
            ?.map((p) => (p.embeds && p.embeds.length ? p.embeds : []))
            ?.flat(1)
            .filter((e) => !!e),
          files: client.channelQueue
            .get(channel.guild.id)
            ?.get(channel.id)
            ?.map((p) => (p.files && p.files.length ? p.files : []))
            ?.flat(1)
            .filter((f) => !!f),
        },
        language,
      );

      if (client.channelQueue.get(channel.guild.id)?.size === 1) {
        client.channelQueue.delete(channel.guild.id);
      } else {
        client.channelQueue.get(channel.guild.id)?.delete(channel.id);
      }

      if (client.channelTimeout.get(channel.guild.id)?.size === 1) {
        client.channelTimeout.delete(channel.guild.id);
      } else {
        client.channelTimeout.get(channel.guild.id)?.delete(channel.id);
      }

      if (client.channelCharLimit.get(channel.guild.id)?.size === 1) {
        client.channelCharLimit.delete(channel.guild.id);
      } else {
        client.channelCharLimit.get(channel.guild.id)?.delete(channel.id);
      }
    }),
  );

  client.channelTimeout.set(channel.guild.id, guildMap);
};
