import * as Discord from 'discord.js';
import constants from '../Other/constants.js';
import getGif from './getGif.js';
import replyMsg from './replyMsg.js';
import replyCmd from './replyCmd.js';
import query from './query.js';
import type DBT from '../../Typings/DataBaseTypings.js';
import type CT from '../../Typings/CustomTypings.js';
import colorSelector from './colorSelector.js';
import languageSelector from './languageSelector.js';
import errorMsg from './errorMsg.js';
import notYours from './notYours.js';
import type { ReturnType } from './getGif.js';

type InteractionKeys = keyof CT.Language['slashCommands']['interactions'];

const reply = async (
 cmd: Discord.ChatInputCommandInteraction | Discord.Message | Discord.ButtonInteraction,
 args: string[],
) => {
 if ('inCachedGuild' in cmd && !cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;

 const parse = async () => {
  if (cmd instanceof Discord.ChatInputCommandInteraction) return parsers.cmdParser(cmd);
  if (cmd instanceof Discord.ButtonInteraction) return parsers.buttonParser(cmd);
  return parsers.msgParser(cmd, args);
 };

 const { author, users, text, otherText, commandName } = await parse();

 const language = await languageSelector(cmd.guildId);
 const lan = language.slashCommands.interactions[commandName as InteractionKeys];

 const desc = getDesc(author, users, language, lan, cmd);
 if (!desc) {
  if (cmd instanceof Discord.Message) errorMsg(cmd, language.errors.noUserMentioned, language);
  return;
 }

 const gifCallers = getGif.filter((c) => c.triggers.includes(commandName));
 const gifCaller = gifCallers[Math.ceil(Math.random() * (gifCallers.length - 1))];
 const gif = (await gifCaller.gifs()) as ReturnType<'gif'>;

 const setting = await query(`SELECT * FROM guildsettings WHERE guildid = $1;`, [cmd.guildId]).then(
  (r: DBT.guildsettings[] | null) => r?.[0]?.interactionsmode ?? null,
 );

 const con = constants.commands.interactions.find((c) => c.name === commandName);
 if (!con) return;

 const embed: Discord.APIEmbed = {
  color: colorSelector(cmd.guild.members.me),
  description: `${desc}  ${otherText}${text.length ? `\n"${text}"` : ''}`,
  footer: gif.anime_name
   ? { text: `${language.slashCommands.rp.gifSrc} ${gif.anime_name}` }
   : undefined,
 };
 if (setting) embed.thumbnail = { url: gif.url };
 else embed.image = { url: gif.url };

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
   language.slashCommands.interactions[cmd.message.interaction?.commandName as InteractionKeys]
 ) {
  embedsBefore.shift();
 }

 if (cmd instanceof Discord.ButtonInteraction) {
  embedsBefore.forEach((e) => {
   const { data } = e;
   payload.embeds?.unshift(data);
  });

  const newUsers = cmd.message.content
   .split(/\s+/g)
   .filter((arg) => arg.startsWith('<@') && arg.endsWith('>'))
   .map((arg) => arg.replace(/\D+/g, ''))
   .filter((arg) => !!arg.length)
   .filter((id) => id !== author.id);

  const lastUser = newUsers.length > 1 ? users.pop() : undefined;
  payload.content = lastUser
   ? `${mapper(newUsers)} ${language.and} ${lastUser}`
   : `${mapper(newUsers)}`;
  if (!lastUser && !newUsers.length) payload.content = '';

  cmd.update(payload as Discord.InteractionUpdateOptions);
  return;
 }

 const lastUser = users.length > 1 ? users.pop() : undefined;
 payload.content = `${
  lastUser ? `${mapper(users)} ${language.and} ${lastUser}` : `${mapper(users)}`
 }`;

 if (cmd instanceof Discord.Message) replyMsg(cmd, payload);
 else replyCmd(cmd, { ...payload, ephemeral: false });
};

export default reply;

export const react = async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await languageSelector(cmd.guildId);

 if (!args.includes(cmd.user.id) && args[0] !== 'everyone') {
  notYours(cmd, language);
  return;
 }

 reply(cmd, args);
};

const parsers = {
 msgParser: (msg: Discord.Message, args: string[]) => ({
  author: msg.author,
  users: msg.mentions.users.map((o) => o),
  text: msg.content
   .split(/\s+/g)
   .filter((w) => !w.startsWith('<@') || !w.endsWith('>'))
   .join(' '),
  otherText: '',
  commandName: args.shift() as string,
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
  commandName: cmd.commandName,
 }),
 buttonParser: async (cmd: Discord.ButtonInteraction<'cached'>) => ({
  author: cmd.user,
  users: [cmd.message.interaction?.user as Discord.User],
  text: '',
  otherText: '',
  commandName: cmd.customId.split('_')[0],
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
 u.map((m) => `<@${typeof m !== 'string' ? m.id : m}>`).join(', ');

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
  }${Array.isArray(lan.others) ? lan.others[1] : ''}`;
 }

 if (users.length === 1 && 'one' in lan) {
  const lastUser = users.length > 1 ? users.pop() : undefined;

  return `${author} ${Array.isArray(lan.one) ? lan.one[0] : lan.one} ${
   lastUser ? `${mapper(users)} ${language.and} ${lastUser}` : `${mapper(users)}`
  }${Array.isArray(lan.one) ? lan.one[1] : ''}`;
 }

 if (users.length > 1 && 'many' in lan) {
  const lastUser = users.length > 1 ? users.pop() : undefined;

  return `${author} ${Array.isArray(lan.many) ? lan.many[0] : lan.many} ${
   lastUser ? `${mapper(users)} ${language.and} ${lastUser}` : `${mapper(users)}`
  }${Array.isArray(lan.many) ? lan.many[1] : ''}`;
 }

 return null;
};
