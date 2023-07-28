import type * as Discord from 'discord.js';
import { Prisma } from '@prisma/client';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings.js';

export default async () => {
 const settingsRows = await ch.DataBase.expiry.findMany({
  where: {
   OR: [
    {
     warns: true,
     warnstime: { not: null },
    },
    {
     mutes: true,
     mutestime: { not: null },
    },
    {
     kicks: true,
     kickstime: { not: null },
    },
    {
     bans: true,
     banstime: { not: null },
    },
    {
     channelbans: true,
     channelbanstime: { not: null },
    },
   ],
  },
 });

 if (!settingsRows) return;

 settingsRows.forEach(async (settingsRow) => {
  if (!client.guilds.cache.get(settingsRow.guildid)) return;

  if (settingsRow.warns && settingsRow.warnstime) {
   expire({ expire: settingsRow.warnstime, guildid: settingsRow.guildid }, 'punish_warns');
  }
  if (settingsRow.mutes && settingsRow.mutestime) {
   expire({ expire: settingsRow.mutestime, guildid: settingsRow.guildid }, 'punish_mutes');
  }
  if (settingsRow.kicks && settingsRow.kickstime) {
   expire({ expire: settingsRow.kickstime, guildid: settingsRow.guildid }, 'punish_kicks');
  }
  if (settingsRow.bans && settingsRow.banstime) {
   expire({ expire: settingsRow.banstime, guildid: settingsRow.guildid }, 'punish_bans');
  }
  if (settingsRow.channelbans && settingsRow.channelbanstime) {
   expire(
    { expire: settingsRow.channelbanstime, guildid: settingsRow.guildid },
    'punish_channelbans',
   );
  }
 });
};

type TableName =
 | 'punish_warns'
 | 'punish_mutes'
 | 'punish_kicks'
 | 'punish_bans'
 | 'punish_channelbans';

const findTable = {
 punish_warns: (findWhere: CT.Argument<(typeof ch)['DataBase']['punish_warns']['findMany'], 0>) =>
  ch.DataBase.punish_warns.findMany(findWhere),
 punish_mutes: (findWhere: CT.Argument<(typeof ch)['DataBase']['punish_mutes']['findMany'], 0>) =>
  ch.DataBase.punish_mutes.findMany(findWhere),
 punish_kicks: (findWhere: CT.Argument<(typeof ch)['DataBase']['punish_kicks']['findMany'], 0>) =>
  ch.DataBase.punish_kicks.findMany(findWhere),
 punish_bans: (findWhere: CT.Argument<(typeof ch)['DataBase']['punish_bans']['findMany'], 0>) =>
  ch.DataBase.punish_bans.findMany(findWhere),
 punish_channelbans: (
  findWhere: CT.Argument<(typeof ch)['DataBase']['punish_channelbans']['findMany'], 0>,
 ) => ch.DataBase.punish_channelbans.findMany(findWhere),
};

const expire = async (row: { expire: Prisma.Decimal; guildid: string }, tableName: TableName) => {
 const findWhere = {
  where: {
   guildid: row.guildid,
   uniquetimestamp: { lt: Math.abs(Date.now() - Number(row.expire)) },
  },
 };

 const tableRows = await findTable[tableName](findWhere);

 if (!tableRows) return;

 tableRows.forEach((r) => {
  const deleteWhere = {
   where: {
    guildid: r.guildid,
    uniquetimestamp: r.uniquetimestamp,
   },
  };

  const deleteTable = {
   punish_warns: () => ch.DataBase.punish_warns.deleteMany(deleteWhere),
   punish_mutes: () => ch.DataBase.punish_mutes.deleteMany(deleteWhere),
   punish_kicks: () => ch.DataBase.punish_kicks.deleteMany(deleteWhere),
   punish_bans: () => ch.DataBase.punish_bans.deleteMany(deleteWhere),
   punish_channelbans: () => ch.DataBase.punish_channelbans.deleteMany(deleteWhere),
  };
  deleteTable[tableName]().then();
 });

 logExpire<TableName>(tableRows, row.guildid);
};

const logExpire = async <T extends TableName>(
 rows: T extends 'punish_warns'
  ? CT.DePromisify<ReturnType<(typeof ch)['DataBase']['punish_warns']['findMany']>>
  : T extends 'punish_mutes'
  ? CT.DePromisify<ReturnType<(typeof ch)['DataBase']['punish_mutes']['findMany']>>
  : T extends 'punish_kicks'
  ? CT.DePromisify<ReturnType<(typeof ch)['DataBase']['punish_kicks']['findMany']>>
  : T extends 'punish_bans'
  ? CT.DePromisify<ReturnType<(typeof ch)['DataBase']['punish_bans']['findMany']>>
  : T extends 'punish_channelbans'
  ? CT.DePromisify<ReturnType<(typeof ch)['DataBase']['punish_channelbans']['findMany']>>
  : never,
 guildid: string,
) => {
 const guild = client.guilds.cache.get(guildid);
 if (!guild) return;

 const channels = await ch.getLogChannels('modlog', guild);
 if (!channels) return;

 await Promise.all(rows.map((p) => guild.members.fetch(p.userid).catch(() => null)));
 await Promise.all(rows.map((p) => ch.getUser(p.userid).catch(() => null)));

 const language = await ch.languageSelector(guildid);
 const lan = language.expire;

 const users = await Promise.all(rows.map((r) => ch.getUser(r.userid)));

 const embeds: (Discord.APIEmbed | undefined)[] = rows.map((p) => {
  const user = users.find((u) => u?.id === p.userid);
  if (!user) return undefined;
  if (!client.user) return undefined;

  const embed: Discord.APIEmbed = {
   description: `**${language.reason}:**\n${p.reason}`,
   author: {
    name: lan.punishmentOf(user),
    url: `https://discord.com/channels/${guild.id}/${p.channelid}/${p.msgid}`,
   },
   color: ch.constants.colors.success,
   fields: [
    {
     name: lan.punishmentIssue,
     value: `<t:${String(p.uniquetimestamp).slice(0, -3)}:F> (<t:${String(p.uniquetimestamp).slice(
      0,
      -3,
     )}:R>)`,
     inline: false,
    },
    {
     name: lan.punishmentIn,
     value: `<#${p.channelid}>\n\`${p.channelname}\` (\`${p.channelid}\`)`,
     inline: false,
    },
    {
     name: lan.punishmentBy,
     value: `<@${p.executorid}>\n\`${p.executorname}\` (\`${p.executorid}\`)`,
     inline: false,
    },
   ],
  };

  if ('duration' in p) {
   const endedAt = lan.endedAt(
    ch.constants.standard.getTime(Number(p.uniquetimestamp) + Number(p.duration)),
   );

   embed.fields?.push(
    {
     name: lan.duration,
     value: `${p.duration ? ch.moment(Number(p.duration), language) : '∞'}`,
     inline: false,
    },
    {
     name: lan.end,
     value: endedAt,
     inline: false,
    },
   );
  }

  embed.fields?.push({
   name: lan.pardonedBy,
   value: language.languageFunction.getUser(client.user),
   inline: false,
  });

  return embed;
 });
 embeds
  .filter((e): e is Discord.APIEmbed => !!e)
  .forEach((e) => ch.send({ id: channels, guildId: guild.id }, { embeds: [e] }, undefined, 10000));
};
