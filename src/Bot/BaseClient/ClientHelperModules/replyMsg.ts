import type DDeno from 'discordeno';
import jobs, { scheduleJob } from 'node-schedule';
import query from './query';
import type CT from '../../Typings/CustomTypings';
import type DBT from '../../Typings/DataBaseTypings';
import objectEmotes from '../Other/ObjectEmotes.json' assert { type: 'json' };
import client from '../DDenoClient.js';

export default async (
  msg: DDeno.Message | void,
  payload: DDeno.CreateMessage,
  command?: CT.Command,
) => {
  if (!msg) return null;

  payload.messageReference = {
    failIfNotExists: false,
    channelId: msg.channelId,
    messageId: msg.id,
  };

  const sentMessage = await client.helpers.sendMessage(msg.channelId, payload).catch((err) => {
    // eslint-disable-next-line no-console
    console.log('msg reply err', err);
  });

  if (!sentMessage) return null;

  cooldownHandler(msg, sentMessage, command);
  deleteCommandHandler(msg, sentMessage);

  return sentMessage;
};

export const cooldownHandler = async (
  msg: DDeno.Message | DDeno.Interaction,
  sentMessage: DDeno.Message,
  command?: CT.Command,
) => {
  if (!msg) return;
  if (!sentMessage) return;
  if (!command) return;
  if (!command.cooldown) return;

  const authorId = 'authorId' in msg ? msg.authorId : msg.user.id;

  const r = await getCooldownRow(msg, command);
  if (!r) return;
  if (!authorId) return;
  if (r.bpuserid?.includes(String(authorId))) return;
  if (r.bpchannelid?.includes(String(msg.channelId))) return;
  if (r.bproleid?.some((id) => msg.member?.roles.includes(BigInt(id)))) return;
  if (r.activechannelid?.length && !r.activechannelid?.includes(String(msg.channelId))) return;

  let emote: string;

  if (Number(r.cooldown) <= 60000) {
    const emoteToUse = objectEmotes.timers[Number(r.cooldown) / 1000];
    emote = `${emoteToUse.name}:${emoteToUse.id}`;
  } else {
    emote = '⌛';
  }

  const reaction = await client.helpers
    .addReaction(sentMessage.channelId, sentMessage.id, emote)
    .catch(() => null);
  if (reaction === null) return;
  const reactions = [emote];

  if (emote === '⌛') {
    const emoteToUse = objectEmotes.timers[60];
    emote = `${emoteToUse.name}:${emoteToUse.id}`;

    jobs.scheduleJob(new Date(Date.now() + (Number(r.cooldown) - 60000)), async () => {
      const secondReaction = await client.helpers
        .addReaction(sentMessage.channelId, sentMessage.id, emote)
        .catch(() => null);

      if (secondReaction === null) return;
      reactions.push(emote);
    });
  }

  jobs.scheduleJob(new Date(Date.now() + Number(r.cooldown)), async () => {
    reactions.forEach((react) => {
      client.helpers.deleteOwnReaction(sentMessage.channelId, sentMessage.id, react);
    });
  });
};

export const deleteCommandHandler = async (
  msg: DDeno.Message | DDeno.Interaction,
  sentMessage: DDeno.Message,
  command?: CT.Command,
) => {
  if (!msg) return;
  if (!sentMessage) return;
  if (!command) return;

  const settings = await getDeleteSettings(msg, command.name);
  if (!settings) return;

  const applyingSettings = settings
    .map((s) => {
      if (s.wlchannelid.includes(String(msg.channelId))) return null;
      if (s.activechannelid.includes(String(msg.channelId))) return s;
      if (!s.activechannelid?.length) return s;

      return null;
    })
    .filter((s): s is DBT.deletecommands => !!s);
  if (!applyingSettings.length) return;

  const s = applyingSettings.sort((a, b) => Number(b.deletetimeout) - Number(a.deletetimeout))[0];
  if (!s.deletetimeout) return;

  scheduleJob(Date.now() + Number(s.deletetimeout), () => {
    if (s.deletereply) {
      client.helpers
        .deleteMessage(
          sentMessage.channelId,
          sentMessage.id,
          command.language.deleteReasons.deleteReply,
        )
        .catch(() => null);
    }
    if (s.deletecommand && msg.channelId) {
      client.helpers.deleteMessage(
        msg.channelId,
        msg.id,
        command.language.deleteReasons.deleteCommand,
      );
    } else if (s.deletecommand && 'token' in msg) {
      client.helpers.deleteOriginalInteractionResponse(msg.token);
    }
  });
};

const getDeleteSettings = async (msg: DDeno.Message | DDeno.Interaction, commandName: string) =>
  query(`SELECT * FROM deletecommands WHERE active = true AND guildid = $1 AND command = $2;`, [
    String(msg.guildId),
    commandName,
  ]).then((r: DBT.deletecommands[] | null) => r);

const getCooldownRow = (msg: DDeno.Message | DDeno.Interaction, command: CT.Command) =>
  query(
    `SELECT * FROM cooldowns WHERE guildid = $1 AND active = true AND command = $2 and cooldown = $3;`,
    [String(msg.guildId), command.name, command.cooldown],
  ).then((r: DBT.cooldowns[] | null) => (r ? r[0] : null));
