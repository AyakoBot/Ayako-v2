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

const cmdParser = (cmd: Discord.ChatInputCommandInteraction) => ({
 author: cmd.user,
 users: [
  cmd.options.getUser('user', false),
  cmd.options.getUser('user-0', false),
  cmd.options.getUser('user-1', false),
  cmd.options.getUser('user-2', false),
  cmd.options.getUser('user-3', false),
  cmd.options.getUser('user-4', false),
  cmd.options.getUser('user-5', false),
  cmd.options.getUser('user-6', false),
  cmd.options.getUser('user-7', false),
  cmd.options.getUser('user-8', false),
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
});

const msgParser = (msg: Discord.Message, args: string[]) => ({
 author: msg.author,
 users: msg.mentions.users.map((o) => o),
 text: msg.content
  .split(/\s+/g)
  .filter((w) => !w.startsWith('<@') || !w.endsWith('>'))
  .join(' '),
 otherText: '',
 commandName: args.shift() as string,
});

const getDesc = <T extends keyof CT.Language['slashCommands']['interactions']>(
 author: Discord.User,
 users: Discord.User[],
 language: CT.Language,
 lan: CT.Language['slashCommands']['interactions'][T],
) => {
 if (users.length === 1 && author.id === users[0].id) return `${author} ${lan.self}`;
 if (!users.length && 'noOne' in lan) return `${author} ${lan.noOne}`;
 if (users.length && 'others' in lan) {
  const lastUser = users.length > 1 ? users.pop() : undefined;

  return `${author} ${Array.isArray(lan.others) ? lan.others[0] : lan.others} ${
   lastUser
    ? `${users.join(', ')} ${language.and} ${lastUser}`
    : `${users.join(', ')}${Array.isArray(lan.others) ? lan.others[1] : ''}`
  }`;
 }
 if (users.length === 1 && 'one' in lan) {
  const lastUser = users.length > 1 ? users.pop() : undefined;

  return `${author} ${Array.isArray(lan.one) ? lan.one[0] : lan.one} ${
   lastUser
    ? `${users.join(', ')} ${language.and} ${lastUser}`
    : `${users.join(', ')}${Array.isArray(lan.one) ? lan.one[1] : ''}`
  }`;
 }
 if (users.length > 1 && 'many' in lan) {
  const lastUser = users.length > 1 ? users.pop() : undefined;

  return `${author} ${Array.isArray(lan.many) ? lan.many[0] : lan.many} ${
   lastUser
    ? `${users.join(', ')} ${language.and} ${lastUser}`
    : `${users.join(', ')}${Array.isArray(lan.many) ? lan.many[1] : ''}`
  }`;
 }

 return null;
};

const reply = async (
 cmd: Discord.ChatInputCommandInteraction | Discord.Message,
 args: string[],
) => {
 if ('inCachedGuild' in cmd && !cmd.inCachedGuild()) return;
 if (!cmd.inGuild()) return;

 const { author, users, text, otherText, commandName } =
  cmd instanceof Discord.Message ? msgParser(cmd, args) : cmdParser(cmd);

 const gifCallers = getGif.filter((c) => c.triggers.includes(commandName));
 const gifCaller = gifCallers[Math.ceil(Math.random() * (gifCallers.length - 1))];
 const gif = (await gifCaller.gifs()) as string;

 const setting = await query(`SELECT * FROM guildsettings WHERE guildid = $1;`, [cmd.guildId]).then(
  (r: DBT.guildsettings[] | null) => r?.[0]?.interactionsmode ?? null,
 );

 const language = await languageSelector(cmd.guildId);
 const lan =
  language.slashCommands.interactions[
   commandName as keyof typeof language.slashCommands.interactions
  ];

 const desc = getDesc(author, users, language, lan);
 if (!desc) {
  if (cmd instanceof Discord.Message) errorMsg(cmd, language.errors.noUserMentioned, language);
  return;
 }

 const embed: Discord.APIEmbed = {
  color: colorSelector(cmd.guild.members.me),
  description: `${desc}  ${otherText}${text.length ? `\n"${text}"` : ''}`,
 };
 if (setting) embed.thumbnail = { url: gif };
 else embed.image = { url: gif };

 const payload: Discord.MessageReplyOptions | Discord.ReplyOptions = { embeds: [embed] };

 if (cmd instanceof Discord.Message) replyMsg(cmd, payload);
 else replyCmd(cmd, { ...payload, ephemeral: false });
};

export default reply;
