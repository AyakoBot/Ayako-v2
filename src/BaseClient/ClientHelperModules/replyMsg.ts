import * as Discord from 'discord.js';
import jobs from 'node-schedule';
import type CT from '../../Typings/CustomTypings.js';
import objectEmotes from './emotes.js';
import DataBase from '../DataBase.js';
import { request } from './requestHandler.js';

// eslint-disable-next-line no-console
const { log } = console;

/**
 * Sends a reply message to a Discord message.
 * @param msg The Discord message to reply to.
 * @param payload The message payload to send.
 * @param command The command that triggered the reply message.
 * @param commandName The name of the command that triggered the reply message.
 * @returns The sent message if successful, otherwise undefined.
 */
export default async <T extends Discord.Message<boolean>>(
 msg: T,
 payload: CT.UsualMessagePayload,
 command?: CT.Command,
 commandName?: string,
): Promise<T | undefined> => {
 if (!msg) return undefined;

 const body = (await Discord.MessagePayload.create(msg, payload, {
  reply: {
   messageReference: msg,
   failIfNotExists: false,
  },
 })
  .resolveBody()
  .resolveFiles()) as { body: Discord.RESTPostAPIChannelMessageJSONBody; files: Discord.RawFile[] };

 const sentMessage = await request.channels
  .sendMessage(msg.guild, msg.channelId, { ...body.body, files: body.files }, msg.client)
  .catch((err) => {
   log('msg reply err', err);
  });

 if (typeof sentMessage === 'undefined' || 'message' in sentMessage) return undefined;

 if (msg.guild && command && commandName) {
  cooldownHandler(msg, sentMessage, command, commandName);
 }

 return sentMessage as T;
};

/**
 * Handles the cooldown for a command and removes the reaction after the cooldown is over.
 * @param msg The message or interaction that triggered the command.
 * @param sentMessage The message or interaction response that was sent as a reply to the command.
 * @param command The command object that was triggered.
 * @param commandName The name of the command that was triggered.
 */
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

 if (!(sentMessage instanceof Discord.Message)) return;

 const reaction = await request.channels.addReaction(sentMessage as Discord.Message<true>, emote);
 if (reaction) return;
 const reactions = [emote];

 if (emote === '⌛') {
  const emoteToUse = objectEmotes.timers[60];
  emote = `${emoteToUse.name}:${emoteToUse.id}`;

  jobs.scheduleJob(new Date(Date.now() + (Number(r.cooldown) * 1000 - 60000)), async () => {
   const secondReaction = await request.channels.addReaction(
    sentMessage as Discord.Message<true>,
    emote,
   );
   if (secondReaction) return;

   reactions.push(emote);
  });
 }

 jobs.scheduleJob(new Date(Date.now() + Number(r.cooldown) * 1000), async () => {
  reactions.forEach((react) => {
   request.channels.deleteOwnReaction(sentMessage as Discord.Message<true>, react);
  });
 });
};

const getCooldownRow = (guild: Discord.Guild, command: CT.Command, commandName: string) =>
 DataBase.cooldowns.findFirst({
  where: { guildid: guild.id, command: commandName, active: true, cooldown: command.cooldown },
 });
