import * as Discord from 'discord.js';
import Jobs from 'node-schedule';
import * as CT from '../../Typings/Typings.js';
import objectEmotes from './emotes.js';
import DataBase from '../DataBase.js';
import { request } from './requestHandler.js';
import constants from '../Other/constants.js';
import error from './error.js';
import cache from './cache.js';

// eslint-disable-next-line no-console
const { log } = console;

/**
 * Sends a reply message to a Discord message.
 * @param msg The Discord message to reply to.
 * @param payload The message payload to send.
 * @param command The command that triggered the reply message.
 * @param commandName The name of the command that triggered the reply message,
 * required for cooldown handling.
 * @returns The sent message if successful, otherwise undefined.
 */
export default async <T extends Discord.Message<boolean>>(
 msg: T,
 payload: CT.UsualMessagePayload,
 commandName?: string,
): Promise<T | undefined> => {
 if (!msg) return undefined;

 const messagePayload = new Discord.MessagePayload(msg, {
  ...payload,
  reply: {
   messageReference: msg,
   failIfNotExists: false,
  },
 });

 const body = (await messagePayload.resolveBody().resolveFiles()) as {
  body: Discord.RESTPostAPIChannelMessageJSONBody;
  files: Discord.RawFile[];
 };

 const sentMessage = await request.channels
  .sendMessage(msg.guild, msg.channelId, { ...body.body, files: body.files }, msg.client)
  .catch((err) => {
   log('msg reply err', err);
  });

 if (typeof sentMessage === 'undefined' || 'message' in sentMessage) return undefined;
 if (msg.guild && commandName) cooldownHandler(msg, sentMessage, commandName);

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
 commandName: string,
) => {
 if (!msg.guild) return;

 const authorId = 'author' in msg ? msg.author.id : msg.user.id;
 const settings = await DataBase.cooldowns.findFirst({
  where: { guildid: msg.guild.id, command: commandName, active: true },
 });

 if (!settings) return;
 if (!authorId) return;
 if (settings.wluserid?.includes(String(authorId))) return;
 if (msg.channelId && settings.wlchannelid?.includes(msg.channelId)) return;

 if (msg.member) {
  const { roles } = msg.member;
  if (Array.isArray(roles) && settings.wlroleid?.some((id) => roles.includes(id))) return;
  if ('cache' in roles && settings.wlroleid?.some((id) => roles.cache.has(id))) return;
 }
 if (
  settings.activechannelid?.length &&
  !settings.activechannelid?.includes(String(msg.channelId))
 ) {
  return;
 }

 let m: Discord.Message<true> | undefined;
 if (sentMessage instanceof Discord.InteractionResponse) {
  sentMessage = await sentMessage.fetch();
  if (!sentMessage) return;
  m = sentMessage as Discord.Message<true>;
 } else m = sentMessage as Discord.Message<true>;
 if (!m) return;

 let emote: string;
 if (Number(settings.cooldown) <= 60) {
  const emoteToUse = objectEmotes.timers[Number(settings.cooldown)];
  emote = `${emoteToUse.name}:${emoteToUse.id}`;
 } else emote = '⌛';

 const { channelId } = m;

 setCooldown(channelId, commandName, Number(settings.cooldown));

 const reaction = await request.channels.addReaction(m, emote);
 if (reaction) {
  error(msg.guild, new Error(reaction.message));
  return;
 }
 const reactions = [emote];

 if (emote === '⌛') {
  const emoteToUse = objectEmotes.timers[60];
  emote = constants.standard.getEmoteIdentifier(emoteToUse);

  Jobs.scheduleJob(new Date(Date.now() + (Number(settings.cooldown) * 1000 - 60000)), async () => {
   if (!m) return;

   const secondReaction = await request.channels.addReaction(m, emote);
   if (secondReaction) {
    if (m.guild) error(m.guild, new Error(secondReaction.message));
    return;
   }

   reactions.push(emote);
  });
 }

 Jobs.scheduleJob(new Date(Date.now() + Number(settings.cooldown) * 1000), async () => {
  reactions.forEach((react) => {
   request.channels.deleteOwnReaction(m as Discord.Message<true>, react);
   deleteCooldown(channelId, commandName);
  });
 });
};

const setCooldown = (channelId: string, commandName: string, cooldown: number) => {
 if (cache.cooldown.has(channelId)) {
  cache.cooldown.get(channelId)?.get(commandName);
 }

 cache.cooldown.set(channelId, new Map().set(commandName, cooldown * 1000));
};

const deleteCooldown = (channelId: string, commandName: string) => {
 if (!cache.cooldown.has(channelId)) return;

 cache.cooldown.get(channelId)?.delete(commandName);
 if (!cache.cooldown.get(channelId)?.size) cache.cooldown.delete(channelId);
};
