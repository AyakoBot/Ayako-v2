import type * as Discord from 'discord.js';
import jobs from 'node-schedule';
import type CT from '../../Typings/CustomTypings.js';
import objectEmotes from './objectEmotes.js';
import DataBase from '../DataBase.js';
import { request } from './requestHandler.js';
import resolveFiles from './resolveFiles.js';

// eslint-disable-next-line no-console
const { log } = console;

export default async <T extends Discord.Message<boolean>>(
 msg: T,
 payload: CT.UsualMessagePayload,
 command?: CT.Command,
 commandName?: string,
): Promise<T | undefined> => {
 if (!msg) return undefined;

 const sentMessage = await request.channels
  .sendMessage(
   msg.guild,
   msg.channelId,
   {
    ...payload,
    files: payload.files ? await resolveFiles(payload.files) : undefined,
    message_reference: {
     message_id: msg.id,
     channel_id: msg.channelId,
     guild_id: msg.guildId ?? undefined,
    },
   },
   msg.client,
  )
  .catch((err) => {
   log('msg reply err', err);
  });

 if (typeof sentMessage === 'undefined' || 'message' in sentMessage) return undefined;

 if (msg.guild && command && commandName) {
  cooldownHandler(msg, sentMessage, command, commandName);
 }

 return sentMessage as T;
};

export const cooldownHandler = async (
 msg:
  | Discord.Message
  | Discord.ButtonInteraction
  | Discord.CommandInteraction
  | Discord.AnySelectMenuInteraction
  | Discord.ModalSubmitInteraction,
 sentMessage: Discord.Message | Discord.InteractionResponse,
 command: CT.Command,
 commandName: string,
) => {
 if (!command.cooldown) return;
 if (!msg.guild) return;

 const authorId = 'author' in msg ? msg.author.id : msg.user.id;

 const r = await getCooldownRow(msg.guild, command, commandName);
 if (!r) return;
 if (!authorId) return;
 if (r.wluserid?.includes(String(authorId))) return;
 if (msg.channel && r.wlchannelid?.includes(msg.channel.id)) return;

 if (msg.member) {
  const { roles } = msg.member;
  if (Array.isArray(roles) && r.wlroleid?.some((id) => roles.includes(id))) return;
  if ('cache' in roles && r.wlroleid?.some((id) => roles.cache.has(id))) return;
 }
 if (r.activechannelid?.length && !r.activechannelid?.includes(String(msg.channelId))) return;

 let emote: string;

 if (Number(r.cooldown) <= 60) {
  const emoteToUse = objectEmotes.timers[Number(r.cooldown)];
  emote = `${emoteToUse.name}:${emoteToUse.id}`;
 } else emote = '⌛';

 if (!('react' in sentMessage)) return;

 const reaction = await sentMessage.react(emote).catch(() => undefined);
 if (reaction === undefined) return;
 const reactions = [emote];

 if (emote === '⌛') {
  const emoteToUse = objectEmotes.timers[60];
  emote = `${emoteToUse.name}:${emoteToUse.id}`;

  jobs.scheduleJob(new Date(Date.now() + (Number(r.cooldown) * 1000 - 60000)), async () => {
   const secondReaction = await sentMessage.react(emote).catch(() => undefined);
   if (secondReaction === undefined) return;

   reactions.push(emote);
  });
 }

 jobs.scheduleJob(new Date(Date.now() + Number(r.cooldown) * 1000), async () => {
  const client = (await import('../Client.js')).default;

  reactions.forEach((react) => {
   sentMessage.reactions.cache
    .get(react)
    ?.users.remove(client.user?.id)
    .catch(() => undefined);
  });
 });
};

const getCooldownRow = (guild: Discord.Guild, command: CT.Command, commandName: string) =>
 DataBase.cooldowns.findFirst({
  where: { guildid: guild.id, command: commandName, active: true, cooldown: command.cooldown },
 });
