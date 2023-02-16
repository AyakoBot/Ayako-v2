import type * as Discord from 'discord.js';
import Jobs from 'node-schedule';
import type CT from '../../Typings/CustomTypings';
import { client } from '../Client.js';

interface MessageCreateOptions extends Omit<Discord.MessageCreateOptions, 'embeds'> {
  embeds?: Discord.APIEmbed[];
}

async function send(
  channels: Discord.TextBasedChannel,
  payload: MessageCreateOptions,
  command?: CT.Command,
  timeout?: number,
): Promise<Discord.Message | null | void>;
async function send(
  channels: Discord.TextBasedChannel[],
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
  channels:
    | Discord.TextBasedChannel
    | Discord.TextBasedChannel[]
    | { id: string[]; guildId: string }
    | { id: string; guildId: string },
  payload: MessageCreateOptions,
  command?: CT.Command,
  timeout?: number,
): Promise<Discord.Message | (Discord.Message | null | void)[] | null | void> {
  if (!channels) return null;

  if (Array.isArray(channels)) {
    const sentMessages = await Promise.all(
      channels.map((ch) => send(ch, payload, command, timeout)),
    );
    return sentMessages;
  }

  if (Array.isArray(channels.id)) {
    const sentMessages = await Promise.all(
      channels.id.map((id) =>
        send(
          { id, guildId: (channels as Discord.GuildTextBasedChannel).guildId },
          payload,
          command,
          timeout,
        ),
      ),
    );
    return sentMessages;
  }

  const response = await client.shard?.broadcastEval(
    async (cl, context) => {
      (cl as unknown as typeof Client).prototype;

      const c = context.channels as
        | Discord.TextBasedChannel
        | {
            id: string;
            guildId: string;
          };

      const { payload: p } = context;
      let { timeout: t } = context;

      if (p.files?.length) t = undefined;
      if (Number(p.embeds?.length) > 1) t = undefined;
      if (p.components?.length) t = undefined;
      if (p.content?.length) t = undefined;

      const channel = !('name' in c) ? cl.channels.cache.get(c.id) : c;
      if (!channel) return null;

      if (!('send' in channel)) return null;

      if (!p.content?.length && !p.embeds?.length && !p.files?.length && !p.components?.length) {
        return null;
      }

      const ch = await import('../ClientHelper.js');

      p.embeds?.forEach((e) => {
        if (e.author && !e.author.url) {
          e.author.url = ch.constants.standard.invite;
        }

        e.fields?.forEach((f) => {
          if (typeof f.inline !== 'boolean') {
            f.inline = true;
          }
        });
      });

      const combineMessages = async (
        channel:
          | Discord.AnyThreadChannel<boolean>
          | Discord.NewsChannel
          | Discord.TextChannel
          | Discord.VoiceChannel,
        embeds: Discord.APIEmbed[],
        timeout: number,
      ) => {
        let guildQueue = ch.channelQueue.get(channel.guildId);
        if (!guildQueue) {
          ch.channelQueue.set(channel.guildId, new Map());
          guildQueue = ch.channelQueue.get(channel.guildId);
        }

        if (!guildQueue) {
          send(channel, { embeds });
          return;
        }

        let channelQueue = guildQueue.get(channel.id);
        if (!channelQueue) {
          guildQueue.set(channel.id, []);
          channelQueue = guildQueue.get(channel.id);
        }

        if (!channelQueue) {
          send(channel, { embeds });
          return;
        }

        if (
          Number(channelQueue.length) + embeds.length > 10 ||
          getEmbedCharLens([...channelQueue, ...embeds]) > 6000
        ) {
          ch.channelTimeout.get(channel.guildId)?.get(channel.id)?.cancel();
          send(channel, { embeds: channelQueue });
          guildQueue.set(channel.id, []);
          channelQueue = guildQueue.get(channel.id);
        }

        if (!channelQueue) {
          send(channel, { embeds });
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
          send(channel, { embeds });
          return;
        }

        timeoutGuild.set(
          channel.guildId,
          Jobs.scheduleJob(new Date(Date.now() + timeout), () => {
            const queuedEmbeds = ch.channelQueue.get(channel.guildId)?.get(channel.id) || [];
            send(channel, { embeds: queuedEmbeds });

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

      if (t && 'guild' in channel && p.embeds?.length) {
        combineMessages(channel, p.embeds, t);
        return null;
      }

      p.embeds?.forEach((p) => {
        p.fields?.forEach((p) => {
          p.value?.length > 1024 ? console.log(p) : null;
        });
      });

      const sentMessage = await channel.send(p as Discord.MessageCreateOptions).catch((err) => {
        // eslint-disable-next-line no-console
        console.log('send err', err);
      });

      return sentMessage;
    },
    { context: { channels, payload, command, timeout } },
  );

  return response?.filter((r): r is Discord.Message<boolean> => !!r);
}

export default send;
