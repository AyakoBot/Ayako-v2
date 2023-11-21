import Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import Prisma from '@prisma/client';
import { getPrefix } from './commandHandler.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';
import { getContent } from '../../autoModerationActionEvents/censor.js';

export default async (msg: Discord.Message<true>) => {
 if (!msg.author) return;
 if (msg.author.bot) return;

 const prefix = await getPrefix(msg);
 const commandName = prefix
  ? msg.content.slice(prefix.length).split(/\s+/)[0].toLowerCase()
  : undefined;
 const language = await ch.getLanguage(msg.guildId);

 self(msg, commandName, language);
 mention(msg, commandName, language);
};

const self = async (
 msg: Discord.Message<true>,
 commandName: string | undefined,
 language: CT.Language,
) => {
 if (commandName === 'afk') return;

 const afk = await getAFK(msg.guildId, msg.author.id);
 if (!afk) return;
 if (Number(afk.since) > Date.now() - 60000) return;

 const embed: Discord.APIEmbed = {
  color: ch.constants.colors.loading,
  description: language.slashCommands.afk.removed(ch.constants.standard.getTime(Number(afk.since))),
 };

 const m = (await ch.send(msg.channel, { embeds: [embed] })) as Discord.Message<true> | undefined;
 Jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
  if (!m) return;
  if (await ch.isDeleteable(m)) ch.request.channels.deleteMessage(m as Discord.Message<true>);
 });

 await ch.DataBase.afk.delete({
  where: {
   userid_guildid: {
    guildid: msg.guildId,
    userid: msg.author.id,
   },
  },
 });

 deleteNick(language, msg.member);
};

const deleteNick = async (language: CT.Language, member?: Discord.GuildMember | null) => {
 if (!member) return;
 if (!member.nickname || !member.nickname.endsWith(' [AFK]')) return;

 const me = await ch.getBotMemberFromGuild(member.guild);
 if (!me) {
  ch.error(member.guild, new Error("I can't find myself in this guild!"));
  return;
 }

 if (!me.permissions.has(Discord.PermissionFlagsBits.ManageNicknames)) return;
 if (!ch.isManageable(member, me)) return;

 ch.request.guilds.editMember(
  member.guild,
  member.id,
  {
   nick: member.displayName.slice(0, member.displayName.length - 6),
  },
  language.slashCommands.afk.removeReason,
 );
};

const mention = async (
 msg: Discord.Message<true>,
 commandName: string | undefined,
 language: CT.Language,
) => {
 if (commandName === 'unafk') return;
 if (msg.mentions.members.size > 10) return;

 const afk = (
  await Promise.all(
   msg.mentions.members.filter((m) => m.id !== msg.author.id).map((m) => getAFK(m.guild.id, m.id)),
  )
 )
  .filter((a): a is Prisma.afk => !!a)
  .filter((a) => !ch.cache.afkCD.get(a.guildid)?.has(a.userid));

 const contents = await Promise.all(
  afk.map((a) =>
   a.text ? getContent(msg.guild, a.text, undefined, undefined, msg.channel) : null,
  ),
 );
 contents.forEach((c, i) => {
  afk[i].text = c;
 });

 const embeds = afk
  .map((a): Discord.APIEmbed | undefined => {
   const afkGuild = ch.cache.afkCD.get(a.guildid);
   if (!afkGuild) ch.cache.afkCD.set(a.guildid, new Set());
   ch.cache.afkCD.get(a.guildid)?.add(a.userid);

   Jobs.scheduleJob(new Date(Date.now() + 10000), () => {
    ch.cache.afkCD.get(a.guildid)?.delete(a.userid);
    if (ch.cache.afkCD.get(a.guildid)?.size) return;
    ch.cache.afkCD.delete(a.guildid);
   });

   return {
    color: ch.constants.colors.loading,
    description: language.slashCommands.afk.isAFK(
     a.userid,
     ch.constants.standard.getTime(Number(a.since)),
     a.text ? `\n${a.text}` : ' ',
    ),
   };
  })
  .filter((e): e is Discord.APIEmbed => !!e);

 if (!embeds.length) return;

 const m = await ch.replyMsg(msg, { embeds, allowed_mentions: { replied_user: true } });

 Jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
  if (!m) return;
  if (await ch.isDeleteable(m)) ch.request.channels.deleteMessage(m);
 });
};

const getAFK = (guildID: string, userID: string) =>
 ch.DataBase.afk.findUnique({
  where: {
   userid_guildid: {
    guildid: guildID,
    userid: userID,
   },
  },
 });
