import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import { getPrefix } from '../../Events/BotEvents/messageEvents/messageCreate/commandHandler.js';
import * as CT from '../../Typings/Typings.js';
import DataBase from '../Bot/DataBase.js';
import { Message } from '../Other/classes.js';
import constants from '../Other/constants.js';
import getGif, { type ReturnType } from './cache/bot/gifs.js';
import encodeString2BigInt from './encodeString2BigInt.js';
import errorCmd from './errorCmd.js';
import errorMsg from './errorMsg.js';
import getBotMemberFromGuild from './getBotMemberFromGuild.js';
import * as getChannel from './getChannel.js';
import getChunks from './getChunks.js';
import getColor from './getColor.js';
import { getLanguage } from './getLanguage.js';
import getPathFromError from './getPathFromError.js';
import getUser from './getUser.js';
import isDeleteable from './isDeleteable.js';
import isEditable from './isEditable.js';
import notYours from './notYours.js';
import replyCmd from './replyCmd.js';
import replyMsg from './replyMsg.js';
import { request } from './requestHandler.js';

const cooldown = new Set<string>();

type InteractionKeys = keyof CT.Language['slashCommands']['interactions'];

/**
 * Handles the reply logic for various types of Discord interactions, including chat input commands,
 * messages, and button interactions.
 * This function processes the interaction, checks for blocked users,
 * retrieves necessary settings and language data,
 * and constructs an appropriate reply or error message.
 *
 * @param cmd - The Discord interaction to handle.
 * Can be a ChatInputCommandInteraction, Message, or ButtonInteraction.
 * @param isActionSubCommand - Optional flag indicating if the interaction is an action sub-command.
 * @param isReply - Optional flag indicating if the interaction is a reply.
 *
 * @returns A promise that resolves when the reply handling is complete.
 */
const reply = async (
 cmd: Discord.ChatInputCommandInteraction | Discord.Message<true> | Discord.ButtonInteraction,
 isActionSubCommand?: boolean,
 isReply?: boolean,
) => {
 if (!isReply && !isActionSubCommand && 'inCachedGuild' in cmd && !cmd.inCachedGuild()) return;
 if (!isReply && isActionSubCommand && 'inCachedGuild' in cmd && cmd.inCachedGuild()) {
  const language = await cmd.client.util.getLanguage(cmd.guild.id);
  cmd.client.util.errorCmd(cmd, language.t.useDefaultRP, language);
  return;
 }

 if (cmd instanceof Discord.ButtonInteraction) {
  while (cooldown.has(cmd.message.id)) {
   // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
   await new Promise((r) => setTimeout(r, 500));
  }
  cooldown.add(cmd.message.id);
 }

 const parse = async () => {
  if (cmd instanceof Discord.ChatInputCommandInteraction) return parsers.cmdParser(cmd);
  if (cmd instanceof Discord.ButtonInteraction) return parsers.buttonParser(cmd);
  return parsers.msgParser(cmd);
 };

 const setting = cmd.guild
  ? await DataBase.guildsettings.findUnique({
     where: { guildid: cmd.guild?.id },
    })
  : undefined;

 const { author, users: allUsers, text, otherText, commandName } = await parse();

 const blockedUsers = await DataBase.blockedusers.findMany({
  where: {
   userid: { in: [...allUsers.map((u) => u.id), author.id] },
   OR: [
    {
     blockeduserid: { in: [...allUsers.map((u) => u.id), author.id] },
     OR: [{ blockedcmd: { has: commandName } }, { blockedcmd: { isEmpty: true } }],
    },
    { blockeduserid: '0', blockedcmd: { has: commandName } },
   ],
  },
 });

 const users = allUsers
  .filter(
   (u) =>
    !blockedUsers.find(
     (b) => b.userid === u?.id || b.blockeduserid === u?.id || b.blockeduserid === '0',
    ),
  )
  .filter((u): u is Discord.User => u instanceof Discord.User);
 const language = await getLanguage(cmd.guildId);
 const lan = language.slashCommands.interactions[commandName as InteractionKeys];
 const con = constants.commands.interactions.find((c) => c.name === commandName);
 const desc = getDesc(author, users, language, lan, cmd, !!setting?.legacyrp);

 if (!desc || (con?.reqUser && !users.length)) {
  if (cmd instanceof Discord.Message) {
   const realCmd = (
    await getChannel.guildTextChannel((cmd as Discord.Message).channelId)
   )?.messages.cache.get((cmd as Discord.Message).id);
   if (!realCmd) return;

   const m = await errorMsg(
    realCmd,
    allUsers.length ? language.slashCommands.rp.cantRP : language.errors.noUserMentioned,
    language,
   );

   Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), async () => {
    if (!m) return;

    if (await isDeleteable(m as Discord.Message<true>)) {
     request.channels.deleteMessage(m as Discord.Message<true>);
    }
    if (await isDeleteable(cmd as Discord.Message<true>)) {
     request.channels.deleteMessage(cmd as Discord.Message<true>);
    }
   });
  } else errorCmd(cmd, language.slashCommands.rp.cantRP, language);
  if (cmd instanceof Discord.ButtonInteraction) cooldown.delete(cmd.message.id);
  return;
 }

 const gifCallers = getGif.filter((c) => c.triggers.includes(commandName));
 const gifCaller = gifCallers[Math.ceil(Math.random() * (gifCallers.length - 1))];
 const gif = (await gifCaller.gifs()) as ReturnType<'gif'> | undefined;

 if (!con) {
  if (cmd instanceof Discord.ButtonInteraction) cooldown.delete(cmd.message.id);
  return;
 }

 const embed: Discord.APIEmbed = {
  color: getColor(cmd.guild ? await getBotMemberFromGuild(cmd.guild) : undefined),
  url: `https://ayakobot.com?exec=${author.id}&cmd=${commandName}&initial=${!(
   cmd instanceof Discord.ButtonInteraction
  )}`,
  description: `${desc}  ${otherText}${text.length ? `\n"${text}"` : ''}`,
  footer: gif?.anime_name
   ? { text: `${language.slashCommands.rp.gifSrc} ${gif.anime_name}` }
   : undefined,
 };
 if ((!setting || setting?.interactionsmode) && gif) {
  embed.thumbnail = gif.url ? { url: gif.url } : undefined;
 } else if (gif) embed.image = gif.url ? { url: gif.url } : undefined;

 const replyUsers =
  cmd instanceof Discord.ButtonInteraction
   ? cmd.customId
      .split('_')
      .slice(1)
      .filter((id) => id !== BigInt(author.id).toString(36))
      .filter((id) => id !== 'everyone')
   : users.map((u) => u.id);

 if (!replyUsers.length && !(cmd instanceof Discord.ButtonInteraction)) replyUsers.push('everyone');

 const isAtEmbedLimit = cmd instanceof Discord.ButtonInteraction && cmd.message.embeds.length > 8;
 const payload = getPayload(embed, con, replyUsers, isAtEmbedLimit, lan, !!setting?.legacyrp);
 const embedsBefore = cmd instanceof Discord.ButtonInteraction ? [...cmd.message.embeds] : [];

 if (replyUsers.length && cmd instanceof Discord.ButtonInteraction && !isAtEmbedLimit) {
  payload.components = getComponents(cmd, replyUsers);
 }

 if (
  cmd instanceof Discord.ButtonInteraction &&
  !replyUsers.length &&
  'request' in
   language.slashCommands.interactions[
    new URL(cmd.message.embeds[0]?.url ?? 'https://ayakobot.com').searchParams.get(
     'cmd',
    ) as InteractionKeys
   ] &&
  !setting?.legacyrp
 ) {
  embedsBefore.shift();
 }

 if (cmd instanceof Discord.ButtonInteraction) {
  embedsBefore.forEach((e) => {
   const { data } = e;
   payload.embeds?.push(data);
  });

  const newUsers = cmd.customId
   .split('_')
   .filter((u) => String(encodeString2BigInt(u, 36)) !== author.id && u !== 'everyone');
  newUsers.shift();

  const lastUser = newUsers.length > 1 ? newUsers.pop() : undefined;
  payload.content = lastUser
   ? `${mapper(newUsers)} ${language.t.and} <@${lastUser}>`
   : `${mapper(newUsers)}`;
  if (!lastUser && !newUsers.length) payload.content = '';

  (payload.embeds as Discord.APIEmbed[]).sort(
   (a, b) => Number(b.url?.includes('true')) - Number(a.url?.includes('true')),
  );

  if (!setting || setting?.editrpcommands || !cmd.channel) {
   payload.content = lastUser
    ? `${mapper(newUsers)} ${language.t.and} <@${encodeString2BigInt(lastUser, 36)}>`
    : `${mapper(newUsers)}`;

   cmd.update(payload as Discord.InteractionUpdateOptions);
  } else {
   if (await isDeleteable((cmd as Discord.ButtonInteraction<'cached'>).message)) {
    request.channels.deleteMessage((cmd as Discord.ButtonInteraction<'cached'>).message);
   }

   payload.ephemeral = false;
   replyCmd(cmd, payload, 'interactions');
  }

  if (cmd instanceof Discord.ButtonInteraction) cooldown.delete(cmd.message.id);
  return;
 }

 const lastUser = users.length > 1 ? users.pop() : undefined;
 payload.content = `${
  lastUser ? `${mapper(users)} ${language.t.and} ${lastUser}` : `${mapper(users)}`
 }`;

 if (cmd instanceof Discord.Message) {
  const msg = cmd as Discord.Message;
  const channel = await getChannel
   .guildTextChannel(msg.channelId)
   .then((c) => (!c || 'message' in c ? undefined : c));
  if (!channel) return;

  const realCmd = await request.channels.getMessage(channel, msg.id);
  if (!realCmd || 'message' in realCmd) return;

  if (
   (await isDeleteable(realCmd as Discord.Message<true>)) &&
   cmd.type !== Discord.MessageType.UserJoin
  ) {
   await request.channels.deleteMessage(realCmd as Discord.Message<true>);
  }
  const content = String(payload.content);
  delete payload.content;

  const m = (await replyMsg(msg, payload, 'interactions')) as Discord.Message<true>;
  if (m && (await isEditable(m))) request.channels.editMsg(m as Discord.Message<true>, { content });
 } else {
  replyCmd(
   cmd,
   { ...payload, ephemeral: false } as Discord.InteractionReplyOptions,
   'interactions',
  );
 }
};

export default reply;

/**
 * Reacts to a button interaction based on the provided arguments.
 * @param cmd - The button interaction to react to.
 * @param args - The arguments to use for reacting to the interaction.
 * @returns A Promise that resolves when the reaction is complete.
 */
export const react = async (cmd: Discord.ButtonInteraction, a: string[]) => {
 const args = a[0] === 'everyone' ? ['everyone'] : a.map((u) => String(encodeString2BigInt(u, 36)));

 const language = await getLanguage(cmd.guildId);

 if (!args.includes(cmd.user.id) && args[0] !== 'everyone') {
  notYours(cmd, language);
  return;
 }

 reply(cmd, false, true);
};

/**
 * Object containing parsers for different types of interactions.
 */
const parsers = {
 /**
  * Parses a message interaction.
  * @param msg The message interaction to parse.
  * @returns An object containing the parsed data.
  */
 msgParser: async (msg: Discord.Message<true>) => ({
  author: msg.author,
  users: await parseMsgUsers(msg),
  text: msg.content
   .slice(Number((await getPrefix(msg))?.length))
   .trim()
   .split(/\s+|\n+/g)
   .filter((w) => (!w.startsWith('<@') || !w.endsWith('>')) && !!w.length)
   .filter((_, i) => i !== 0)
   .join(' '),
  otherText: '',
  commandName: (
   msg.content
    .slice(Number((await getPrefix(msg))?.length))
    .trim()
    .split(/\s+|\n+/g)
    .shift() as string
  ).toLowerCase(),
 }),

 /**
  * Parses a command interaction.
  * @param cmd The command interaction to parse.
  * @returns An object containing the parsed data.
  */
 cmdParser: (cmd: Discord.ChatInputCommandInteraction) => ({
  author: cmd.user,
  users: [
   cmd.options.getUser('user', false),
   cmd.options.getUser('user-0', false),
   cmd.options.getUser('user-1', false),
   cmd.options.getUser('user-2', false),
   cmd.options.getUser('user-3', false),
   cmd.options.getUser('user-4', false),
   cmd.options.getUser('user-5', false),
  ].filter((u): u is Discord.User => !!u),
  text: cmd.options.getString('text', false) ?? '',
  otherText: constants.commands.interactions
   .filter((c) => 'specialOptions' in c)
   .map((c) =>
    (
     c as unknown as {
      name: string;
      desc: string;
      users: boolean;
      reqUsers: boolean;
      specialOptions: { name: string; desc: string }[];
     }
    ).specialOptions.map((o) => cmd.options.getString(o.name, false) ?? ''),
   )
   .flat(1),
  commandName: !cmd.inCachedGuild()
   ? cmd.options.data.find((c) => c.type === Discord.ApplicationCommandOptionType.Subcommand)!.name
   : cmd.commandName.toLowerCase(),
 }),

 /**
  * Parses a button interaction.
  * @param cmd The button interaction to parse.
  * @returns An object containing the parsed data.
  */
 buttonParser: async (cmd: Discord.ButtonInteraction) => ({
  author: cmd.user,
  users: [
   cmd.message.interactionMetadata?.user ??
    (await cmd.client.util.request.users
     .get(
      cmd.guild,
      new URL(cmd.message.embeds[0]?.url ?? 'https://ayakobot.com').searchParams.get('exec') ??
       cmd.client.user.id,
      cmd.client,
     )
     .then((u) => ('message' in u ? undefined : u))),
  ].filter((u): u is Discord.User => !!u && !('message' in u)),
  text: '',
  otherText: '',
  commandName: cmd.customId.split('_')[0].toLowerCase(),
 }),
};

/**
 * Returns an array of Discord API action row components
 * for a given button interaction and an array of reply users.
 * @param cmd - The Discord button interaction.
 * @param replyUsers - An array of user IDs to include in the custom ID of the returned components.
 * @returns An array of Discord API action row components.
 */
const getComponents = (
 cmd: Discord.ButtonInteraction,
 replyUsers: string[],
): Discord.APIActionRowComponent<Discord.APIButtonComponent>[] => [
 {
  type: Discord.ComponentType.ActionRow,
  components: (
   cmd.message.components[0] as Discord.ActionRow<Discord.MessageActionRowComponent>
  ).components
   .filter((c): c is Discord.ButtonComponent => c.type === Discord.ComponentType.Button)
   .map((c) => ({
    label: c.label as string,
    custom_id: `${c.customId?.split(/_+/g)[0]}_${replyUsers
     .map((u) => (u.match(/\D/g)?.length ? u : BigInt(u).toString(36)))
     .join('_')}`,
    style: Discord.ButtonStyle.Secondary,
    type: c.type,
   })),
 },
];

/**
 * Maps an array of Discord users or user IDs to an array of user mentions.
 * @param users An array of Discord users or user IDs.
 * @returns A string containing user mentions separated by commas.
 */
const mapper = (u: (Discord.User | string)[]) =>
 u
  .map((m) => `<@${typeof m !== 'string' ? m.id : encodeString2BigInt(m, 36)}>`)
  .filter((a, index, arr) => arr.indexOf(a) === index)
  .join(', ');

/**
 * Returns a message payload for a Discord interaction response.
 * @template T - The type of the interaction language object.
 * @param {Discord.APIEmbed} embed - The embed to include in the message payload.
 * @param {(typeof constants.commands.interactions)[number]} con - The interaction constants object.
 * @param {string[]} replyUsers - The users to reply to.
 * @param {boolean} isAtEmbedLimit - Whether the embed limit has been reached.
 * @param {CT.Language['slashCommands']['interactions'][T]} lan - The interaction language object.
 * @param {boolean} legacyrp - Whether to use legacy reply format.
 * @returns {CT.UsualMessagePayload} - The message payload for the interaction response.
 */
const getPayload = <T extends keyof CT.Language['slashCommands']['interactions']>(
 embed: Discord.APIEmbed,
 con: (typeof constants.commands.interactions)[number],
 replyUsers: string[],
 isAtEmbedLimit: boolean,
 lan: CT.Language['slashCommands']['interactions'][T],
 legacyrp: boolean,
): CT.UsualMessagePayload => ({
 embeds: [embed],
 components: legacyrp
  ? []
  : [
     con.buttons?.length && replyUsers.length && !isAtEmbedLimit
      ? ({
         type: Discord.ComponentType.ActionRow,
         components: con.buttons?.map(
          (b, i) =>
           ({
            type: Discord.ComponentType.Button,
            label: 'buttons' in lan ? lan.buttons[i] : b,
            custom_id: `${b}_${replyUsers
             .map((u) => (u.match(/\D/g)?.length ? u : BigInt(u).toString(36)))
             .join('_')}`,
            style: Discord.ButtonStyle.Secondary,
           }) as Discord.APIButtonComponent,
         ),
        } as Discord.APIActionRowComponent<Discord.APIButtonComponent>)
      : undefined,
    ].filter((b): b is Discord.APIActionRowComponent<Discord.APIButtonComponent> => !!b),
});

/**
 * Returns a string describing the interaction based on the provided parameters.
 * @template T - The type of the interaction.
 * @param author - The user who initiated the interaction.
 * @param originalUsers - An array of users involved in the interaction.
 * @param language - The language object containing the interaction descriptions.
 * @param lan - The specific interaction description to use.
 * @param cmd - The interaction command object.
 * @param legacyrp - A boolean indicating whether the interaction is using legacy RP.
 * @returns A string describing the interaction.
 */
const getDesc = <T extends keyof CT.Language['slashCommands']['interactions']>(
 author: Discord.User,
 originalUsers: readonly Discord.User[],
 language: CT.Language,
 lan: CT.Language['slashCommands']['interactions'][T],
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction | Discord.Message,
 legacyrp: boolean,
) => {
 const users = [...originalUsers];

 if (users.length === 1 && author.id === users[0].id) return `${author} ${lan.self}`;
 if (!users.length && 'noOne' in lan) return `${author} ${lan.noOne}`;

 if ('request' in lan && !(cmd instanceof Discord.ButtonInteraction) && !legacyrp) {
  return `${author} ${lan.request}`;
 }

 if (users.length && 'others' in lan) {
  const lastUser = users.length > 1 ? users.pop() : undefined;

  return `${author} ${Array.isArray(lan.others) ? lan.others[0] : lan.others} ${
   lastUser ? `${mapper(users)} ${language.t.and} ${lastUser}` : `${mapper(users)}`
  }${Array.isArray(lan.others) ? ` ${lan.others[1]}` : ''}`;
 }

 if (users.length === 1 && 'one' in lan) {
  const lastUser = users.length > 1 ? users.pop() : undefined;

  return `${author} ${Array.isArray(lan.one) ? lan.one[0] : lan.one} ${
   lastUser ? `${mapper(users)} ${language.t.and} ${lastUser}` : `${mapper(users)}`
  }${Array.isArray(lan.one) ? ` ${lan.one[1]}` : ''}`;
 }

 if (users.length > 1 && 'many' in lan) {
  const lastUser = users.length > 1 ? users.pop() : undefined;

  return `${author} ${Array.isArray(lan.many) ? lan.many[0] : lan.many} ${
   lastUser ? `${mapper(users)} ${language.t.and} ${lastUser}` : `${mapper(users)}`
  }${Array.isArray(lan.many) ? ` ${lan.many[1]}` : ''}`;
 }

 return null;
};

/**
 * Parses mentioned users in a message and returns an array of Discord.User objects.
 * @param msg The message to parse.
 * @returns An array of Discord.User objects representing the mentioned users in the message.
 */
const parseMsgUsers = async (msg: Discord.Message<true>) => {
 const client = (await import('../Bot/Client.js')).default as Discord.Client;

 const mentionedUsers = msg.mentions.users.size
  ? msg.mentions.users
     .map((o) => o)
     .filter((u): u is Discord.User => !!u && u.id !== client.user?.id)
  : undefined;

 if (mentionedUsers?.length) {
  if (mentionedUsers.length < 7) return mentionedUsers;

  const mentionChunks = getChunks(mentionedUsers, 6);

  const messages = new Array(mentionChunks.length)
   .fill(null)
   .map(() => structuredClone(msg)) as Discord.Message[];

  mentionChunks.forEach((c, i) => {
   if (i === 0) return;

   const message = new Message(msg.client, {
    id: messages[i].id,
    channel_id: messages[i].channelId,
    author: {
     id: messages[i].author.id,
     username: messages[i].author.username,
     avatar: messages[i].author.avatar,
     discriminator: messages[i].author.discriminator,
     global_name: messages[i].author.globalName,
    },
    content: messages[i].content,
    timestamp: new Date(messages[i].createdTimestamp).toISOString(),
    edited_timestamp: null,
    tts: messages[i].tts,
    mention_everyone: messages[i].mentions.everyone,
    mention_roles: [],
    mention_channels: [],
    attachments: [],
    embeds: [],
    reactions: [],
    pinned: false,
    type: Discord.MessageType.UserJoin,
    mentions: c.map((u) => ({
     id: u.id,
     username: u.username,
     avatar: u.avatar,
     discriminator: u.discriminator,
     global_name: u.globalName,
    })),
   });

   reply(message);
  });

  return mentionChunks[0];
 }

 if (!msg.reference) return [];
 const channel = await getChannel.guildTextChannel(msg.reference.channelId);
 if (!channel) return [];

 const reference = msg.reference
  ? await request.channels.getMessage(channel, msg.reference.messageId as string)
  : undefined;
 if (!reference || 'message' in reference) return [];

 if (reference.author.id !== client.user?.id) return [reference.author];

 const embed = reference.embeds.find((e) =>
  e.url ? new URL(e.url).searchParams.get('initial') === 'true' : false,
 );
 if (!embed) return [];

 const url = new URL(embed.url as string);
 const executorId = url.searchParams.get('exec') as string;
 return [await getUser(executorId)].filter((u): u is Discord.User => !!u);
};
