import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import clone from 'lodash.clonedeep';
import constants from '../Other/constants.js';
import getGif from './getGif.js';
import replyCmd from './replyCmd.js';
import send from './send.js';
import query from './query.js';
import type CT from '../../Typings/CustomTypings.js';
import colorSelector from './colorSelector.js';
import languageSelector from './languageSelector.js';
import errorMsg from './errorMsg.js';
import notYours from './notYours.js';
import type { ReturnType } from './getGif.js';
import { getPrefix } from '../../Events/messageEvents/messageCreate/commandHandler.js';
import getUser from './getUser.js';
import getChunks from './getChunks.js';

type InteractionKeys = keyof CT.Language['slashCommands']['interactions'];

const reply = async (
 cmd:
  | Omit<Discord.ChatInputCommandInteraction, 'guild' | 'client'>
  | Omit<Discord.Message, 'guild' | 'client'>
  | Omit<Discord.ButtonInteraction, 'guild' | 'client'>,
 guild: Discord.Guild | null,
) => {
 if ('inCachedGuild' in cmd && !cmd.inCachedGuild()) return;
 if (!guild) return;
 if (!cmd.inGuild()) return;

 const parse = async () => {
  if (cmd instanceof Discord.ChatInputCommandInteraction) return parsers.cmdParser(cmd);
  if (cmd instanceof Discord.ButtonInteraction) return parsers.buttonParser(cmd);
  return parsers.msgParser(cmd);
 };

 const { author, users, text, otherText, commandName } = await parse();

 const language = await languageSelector(cmd.guildId);
 const lan = language.slashCommands.interactions[commandName as InteractionKeys];
 const con = constants.commands.interactions.find((c) => c.name === commandName);
 const desc = getDesc(author, users, language, lan, cmd);

 if (!desc || (con?.reqUser && !users.length)) {
  if (cmd instanceof Discord.Message) {
   const realCmd = (
    guild.channels.cache.get(
     (cmd as Discord.Message).channelId,
    ) as unknown as Discord.TextBasedChannel
   ).messages.cache.get((cmd as Discord.Message).id);
   if (!realCmd) return;

   const m = await errorMsg(realCmd, language.errors.noUserMentioned, language);
   Jobs.scheduleJob(new Date(Date.now() + 10000), () => {
    if (m?.deletable) m.delete();
    if ('deletable' in cmd && (cmd as Discord.Message<true>).deletable && 'delete' in cmd) {
     (cmd as Discord.Message<true>).delete();
    }
   });
  }
  return;
 }

 const gifCallers = getGif.filter((c) => c.triggers.includes(commandName));
 const gifCaller = gifCallers[Math.ceil(Math.random() * (gifCallers.length - 1))];
 const gif = (await gifCaller.gifs()) as ReturnType<'gif'> | undefined;

 const setting = await query(`SELECT * FROM guildsettings WHERE guildid = $1;`, [cmd.guildId], {
  returnType: 'guildsettings',
  asArray: false,
 }).then((r) => r?.interactionsmode);

 if (!con) return;

 const embed: Discord.APIEmbed = {
  color: colorSelector(guild.members.me),
  url: `https://ayakobot.com?exec=${author.id}&cmd=${commandName}&initial=${!(
   cmd instanceof Discord.ButtonInteraction
  )}`,
  description: `${desc}  ${otherText}${text.length ? `\n"${text}"` : ''}`,
  footer: gif?.anime_name
   ? { text: `${language.slashCommands.rp.gifSrc} ${gif.anime_name}` }
   : undefined,
 };
 if (setting && gif) embed.thumbnail = { url: gif.url };
 else if (gif) embed.image = { url: gif.url };

 const replyUsers =
  cmd instanceof Discord.ButtonInteraction
   ? cmd.customId
      .split('_')
      .slice(1)
      .filter((id) => id !== author.id)
      .filter((id) => id !== 'everyone')
   : users.map((u) => u.id);

 if (!replyUsers.length && !(cmd instanceof Discord.ButtonInteraction)) replyUsers.push('everyone');

 const isAtEmbedLimit = cmd instanceof Discord.ButtonInteraction && cmd.message.embeds.length > 8;
 const payload = getPayload(embed, con, replyUsers, isAtEmbedLimit, lan);
 const embedsBefore = cmd instanceof Discord.ButtonInteraction ? [...cmd.message.embeds] : [];

 if (replyUsers.length && cmd instanceof Discord.ButtonInteraction && !isAtEmbedLimit) {
  payload.components = getComponents(cmd, replyUsers);
 }

 if (
  cmd instanceof Discord.ButtonInteraction &&
  !replyUsers.length &&
  'request' in
   language.slashCommands.interactions[
    (cmd.message.interaction?.commandName ??
     new URL(cmd.message.embeds[0]?.url ?? 'https://ayakobot.com').searchParams.get(
      'cmd',
     )) as InteractionKeys
   ]
 ) {
  embedsBefore.shift();
 }

 if (cmd instanceof Discord.ButtonInteraction) {
  embedsBefore.forEach((e) => {
   const { data } = e;
   payload.embeds?.push(data);
  });

  const newUsers = cmd.customId.split('_').filter((u) => u !== author.id && u !== 'everyone');
  newUsers.shift();

  const lastUser = newUsers.length > 1 ? newUsers.pop() : undefined;
  payload.content = lastUser
   ? `${mapper(newUsers)} ${language.and} <@${lastUser}>`
   : `${mapper(newUsers)}`;
  if (!lastUser && !newUsers.length) payload.content = '';

  (payload.embeds as Discord.APIEmbed[]).sort(
   (a, b) => Number(b.url?.includes('true')) - Number(a.url?.includes('true')),
  );

  cmd.update(payload as Discord.InteractionUpdateOptions);
  return;
 }

 const lastUser = users.length > 1 ? users.pop() : undefined;
 payload.content = `${
  lastUser ? `${mapper(users)} ${language.and} ${lastUser}` : `${mapper(users)}`
 }`;

 if (cmd instanceof Discord.Message) {
  const realCmd = (
   guild.channels.cache.get(
    (cmd as Discord.Message).channelId,
   ) as unknown as Discord.TextBasedChannel
  ).messages.cache.get((cmd as Discord.Message).id);
  if (!realCmd) return;

  if ((realCmd as Discord.Message<true>).deletable) (realCmd as Discord.Message<true>).delete();
  const content = String(payload.content);
  delete payload.content;

  const m = await send(realCmd.channel, payload as never);
  if (m?.editable) m.edit({ content });
 } else replyCmd(cmd, { ...payload, ephemeral: false } as Discord.InteractionReplyOptions);
};

export default reply;

export const react = async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await languageSelector(cmd.guildId);

 if (!args.includes(cmd.user.id) && args[0] !== 'everyone') {
  notYours(cmd, language);
  return;
 }

 reply(cmd, cmd.guild);
};

const parsers = {
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
 cmdParser: (cmd: Discord.ChatInputCommandInteraction) => ({
  author: cmd.user,
  users: [
   cmd.options.getUser('user', false),
   cmd.options.getUser('user-0', false),
   cmd.options.getUser('user-1', false),
   cmd.options.getUser('user-2', false),
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
  commandName: cmd.commandName.toLowerCase(),
 }),
 buttonParser: async (cmd: Discord.ButtonInteraction<'cached'>) => ({
  author: cmd.user,
  users: [
   (cmd.message.interaction?.user as Discord.User) ??
    (await cmd.client.users.fetch(
     new URL(cmd.message.embeds[0]?.url ?? 'https://ayakobot.com').searchParams.get('exec') ??
      cmd.client.user.id,
    )),
  ].filter((u) => !!u),
  text: '',
  otherText: '',
  commandName: cmd.customId.split('_')[0].toLowerCase(),
 }),
};

const getComponents = (
 cmd: Discord.ButtonInteraction,
 replyUsers: string[],
): Discord.APIActionRowComponent<Discord.APIButtonComponent>[] => [
 {
  type: Discord.ComponentType.ActionRow,
  components: cmd.message.components[0].components
   .filter((c): c is Discord.ButtonComponent => c.type === Discord.ComponentType.Button)
   .map((c) => ({
    label: c.label as string,
    custom_id: `${c.customId?.split(/_+/g)[0]}_${replyUsers.join('_')}`,
    style: Discord.ButtonStyle.Secondary,
    type: c.type,
   })),
 },
];

const mapper = (u: (Discord.User | string | CT.bEvalUser)[]) =>
 u
  .map((m) => `<@${typeof m !== 'string' ? m.id : m}>`)
  .filter((a, index, arr) => arr.indexOf(a) === index)
  .join(', ');

const getPayload = <T extends keyof CT.Language['slashCommands']['interactions']>(
 embed: Discord.APIEmbed,
 con: (typeof constants.commands.interactions)[number],
 replyUsers: string[],
 isAtEmbedLimit: boolean,
 lan: CT.Language['slashCommands']['interactions'][T],
): Discord.MessageReplyOptions | Discord.InteractionReplyOptions => ({
 embeds: [embed],
 components: [
  con.buttons?.length && replyUsers.length && !isAtEmbedLimit
   ? ({
      type: Discord.ComponentType.ActionRow,
      components: con.buttons?.map(
       (b, i) =>
        ({
         type: Discord.ComponentType.Button,
         label: 'buttons' in lan ? lan.buttons[i] : b,
         custom_id: `${b}_${replyUsers.join('_')}`,
         style: Discord.ButtonStyle.Secondary,
        } as Discord.APIButtonComponent),
      ),
     } as Discord.APIActionRowComponent<Discord.APIButtonComponent>)
   : undefined,
 ].filter((b): b is Discord.APIActionRowComponent<Discord.APIButtonComponent> => !!b),
});

const getDesc = <T extends keyof CT.Language['slashCommands']['interactions']>(
 author: Discord.User,
 originalUsers: readonly Discord.User[] | CT.bEvalUser[],
 language: CT.Language,
 lan: CT.Language['slashCommands']['interactions'][T],
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction | Discord.Message,
) => {
 const users = [...originalUsers];

 if (users.length === 1 && author.id === users[0].id) return `${author} ${lan.self}`;
 if (!users.length && 'noOne' in lan) return `${author} ${lan.noOne}`;

 if ('request' in lan && !(cmd instanceof Discord.ButtonInteraction)) {
  return `${author} ${lan.request}`;
 }

 if (users.length && 'others' in lan) {
  const lastUser = users.length > 1 ? users.pop() : undefined;

  return `${author} ${Array.isArray(lan.others) ? lan.others[0] : lan.others} ${
   lastUser ? `${mapper(users)} ${language.and} ${lastUser}` : `${mapper(users)}`
  }${Array.isArray(lan.others) ? ` ${lan.others[1]}` : ''}`;
 }

 if (users.length === 1 && 'one' in lan) {
  const lastUser = users.length > 1 ? users.pop() : undefined;

  return `${author} ${Array.isArray(lan.one) ? lan.one[0] : lan.one} ${
   lastUser ? `${mapper(users)} ${language.and} ${lastUser}` : `${mapper(users)}`
  }${Array.isArray(lan.one) ? ` ${lan.one[1]}` : ''}`;
 }

 if (users.length > 1 && 'many' in lan) {
  const lastUser = users.length > 1 ? users.pop() : undefined;

  return `${author} ${Array.isArray(lan.many) ? lan.many[0] : lan.many} ${
   lastUser ? `${mapper(users)} ${language.and} ${lastUser}` : `${mapper(users)}`
  }${Array.isArray(lan.many) ? ` ${lan.many[1]}` : ''}`;
 }

 return null;
};

const parseMsgUsers = async (msg: Discord.Message<true>) => {
 const client = (await import('../Client.js')).default as Discord.Client;

 const mentionedUsers = msg.mentions.users.size
  ? msg.mentions.users
     .map((o) => o)
     .filter((u): u is Discord.User => !!u && u.id !== client.user?.id)
  : undefined;

 if (mentionedUsers?.length) {
  if (mentionedUsers.length < 5) return mentionedUsers;

  const mentionChunks = getChunks(mentionedUsers, 4);

  const messages = new Array(mentionChunks.length)
   .fill(null)
   .map(() => clone(msg)) as Discord.Message[];

  mentionChunks.forEach((c, i) => {
   if (i === 0) return;

   messages[i].mentions.users = new Discord.Collection(c.map((u) => [u.id, u]));
   reply(messages[i], msg.guild);
  });

  return mentionChunks[0];
 }

 const reference = await msg.fetchReference().catch(() => undefined);
 if (!reference) return [];

 if (reference.author.id !== client.user?.id) return [reference.author];

 const embed = reference.embeds.find((e) =>
  e.url ? new URL(e.url).searchParams.get('initial') === 'true' : false,
 );
 if (!embed) return [];

 const url = new URL(embed.url as string);
 const executorId = url.searchParams.get('exec') as string;
 return [await getUser(executorId)].filter((u): u is CT.bEvalUser => !!u);
};
