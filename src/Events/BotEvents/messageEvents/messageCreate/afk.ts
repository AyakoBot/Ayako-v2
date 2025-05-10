import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import Jobs from 'node-schedule';
import * as CT from '../../../../Typings/Typings.js';
import { getContent } from '../../autoModerationActionEvents/censor.js';
import { getPrefix } from './commandHandler.js';
import client from '../../../../BaseClient/Bot/Client.js';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';

export default async (msg: Discord.Message<true>) => {
 if (!msg.author) return;
 if (msg.author.bot) return;

 const prefix = await getPrefix(msg);
 const commandName = prefix
  ? msg.content.slice(prefix.length).split(/\s+/)[0].toLowerCase()
  : undefined;
 const language = await client.util.getLanguage(msg.guildId);

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
  color: CT.Colors.Loading,
  description: language.slashCommands.afk.removed(
   client.util.constants.standard.getTime(Number(afk.since)),
  ),
 };

 const m = (await client.util.send(msg.channel, { embeds: [embed] })) as
  | Discord.Message<true>
  | undefined;
 Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), async () => {
  if (!m) return;
  if (await client.util.isDeleteable(m)) {
   client.util.request.channels.deleteMessage(m as Discord.Message<true>);
  }
 });

 await client.util.DataBase.afk.delete({
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

 client.util.request.guilds.editMember(
  member,
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

 const settings = await msg.client.util.DataBase.afksettings.upsert({
  where: { guildid: msg.guildId },
  create: { guildid: msg.guildId },
  update: {},
 });

 const afk = (
  await Promise.all(
   msg.mentions.members.filter((m) => m.id !== msg.author.id).map((m) => getAFK(m.guild.id, m.id)),
  )
 )
  .filter((a): a is Prisma.afk => !!a)
  .filter((a) => !client.util.cache.afkCD.get(a.guildid)?.has(a.userid));

 const contents = await Promise.all(
  afk.map((a) =>
   a.text
    ? getContent(
       msg.guild,
       a.text,
       undefined,
       undefined,
       msg.channel,
       msg.mentions.members.find((m) => m.id === a.userid)?.roles.cache.map((r) => r),
      )
    : null,
  ),
 );
 contents.forEach((c, i) => {
  afk[i].text = c ? c.slice(0, Number(settings?.maxLetters)) : null;
 });

 const embeds = afk
  .map((a): Discord.APIEmbed | undefined => {
   const afkGuild = client.util.cache.afkCD.get(a.guildid);
   if (!afkGuild) client.util.cache.afkCD.set(a.guildid, new Set());
   client.util.cache.afkCD.get(a.guildid)?.add(a.userid);

   Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), () => {
    client.util.cache.afkCD.get(a.guildid)?.delete(a.userid);
    if (client.util.cache.afkCD.get(a.guildid)?.size) return;
    client.util.cache.afkCD.delete(a.guildid);
   });

   return {
    color: CT.Colors.Loading,
    description: language.slashCommands.afk.isAFK(
     a.userid,
     client.util.constants.standard.getTime(Number(a.since)),
     a.text ? `\n${a.text}` : ' ',
    ),
   };
  })
  .filter((e): e is Discord.APIEmbed => !!e);

 if (!embeds.length) return;

 const m = await client.util.replyMsg(msg, {
  embeds,
  allowed_mentions: { replied_user: true },
 });

 Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 10000), async () => {
  if (!m) return;
  if (await client.util.isDeleteable(m)) client.util.request.channels.deleteMessage(m);
 });
};

const getAFK = (guildId: string, userId: string) =>
 client.util.DataBase.afk.findUnique({
  where: {
   userid_guildid: {
    guildid: guildId,
    userid: userId,
   },
  },
 });
