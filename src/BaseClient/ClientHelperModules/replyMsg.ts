import type * as Discord from 'discord.js';
import jobs from 'node-schedule';
import type CT from '../../Typings/CustomTypings.js';
import objectEmotes from './objectEmotes.js';
import DataBase from '../DataBase.js';

// eslint-disable-next-line no-console
const { log } = console;

export default async (
 msg: Discord.Message,
 payload: Discord.MessagePayload | Discord.MessageReplyOptions,
 command?: CT.Command,
 commandName?: string,
) => {
 if (!msg) return undefined;

 const sentMessage = await msg.reply(payload).catch((err) => {
  log('msg reply err', err);
 });

 if (!sentMessage) return undefined;

 if (msg.guild && command && commandName) {
  cooldownHandler(msg, sentMessage, command, commandName);
 }

 return sentMessage;
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

 if (Number(r.cooldown) <= 60000) {
  const emoteToUse = objectEmotes.timers[Number(r.cooldown) / 1000];
  emote = `${emoteToUse.name}:${emoteToUse.id}`;
 } else emote = '⌛';

 if (!('react' in sentMessage)) return;

 const reaction = await sentMessage.react(emote).catch(() => undefined);
 if (reaction === undefined) return;
 const reactions = [emote];

 if (emote === '⌛') {
  const emoteToUse = objectEmotes.timers[60];
  emote = `${emoteToUse.name}:${emoteToUse.id}`;

  jobs.scheduleJob(new Date(Date.now() + (Number(r.cooldown) - 60000)), async () => {
   const secondReaction = await sentMessage.react(emote).catch(() => undefined);
   if (secondReaction === undefined) return;

   reactions.push(emote);
  });
 }

 jobs.scheduleJob(new Date(Date.now() + Number(r.cooldown)), async () => {
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
