import { Prisma } from '@prisma/client';
import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

export default async () => {
 const settingsRows = await client.util.DataBase.expiry.findMany({
  where: {
   OR: [
    { warns: true, warnstime: { not: null } },
    { mutes: true, mutestime: { not: null } },
    { kicks: true, kickstime: { not: null } },
    { bans: true, banstime: { not: null } },
    { channelbans: true, channelbanstime: { not: null } },
   ],
  },
 });

 if (!settingsRows) return;

 settingsRows.forEach(async (settingsRow) => {
  if (!client.guilds.cache.get(settingsRow.guildid)) return;

  if (settingsRow.warns && settingsRow.warnstime) {
   expire({ expire: settingsRow.warnstime, guildid: settingsRow.guildid }, CT.PunishmentType.Warn);
  }
  if (settingsRow.mutes && settingsRow.mutestime) {
   expire({ expire: settingsRow.mutestime, guildid: settingsRow.guildid }, CT.PunishmentType.Mute);
  }
  if (settingsRow.kicks && settingsRow.kickstime) {
   expire({ expire: settingsRow.kickstime, guildid: settingsRow.guildid }, CT.PunishmentType.Kick);
  }
  if (settingsRow.bans && settingsRow.banstime) {
   expire({ expire: settingsRow.banstime, guildid: settingsRow.guildid }, CT.PunishmentType.Ban);
  }
  if (settingsRow.channelbans && settingsRow.channelbanstime) {
   expire(
    { expire: settingsRow.channelbanstime, guildid: settingsRow.guildid },
    CT.PunishmentType.Channelban,
   );
  }
 });
};

type TableName =
 | CT.PunishmentType.Warn
 | CT.PunishmentType.Mute
 | CT.PunishmentType.Kick
 | CT.PunishmentType.Ban
 | CT.PunishmentType.Channelban;

const findTable = {
 [CT.PunishmentType.Warn]: (
  findWhere: Parameters<(typeof client.util)['DataBase']['punish_warns']['findMany']>[0],
 ) => client.util.DataBase.punish_warns.findMany(findWhere),
 [CT.PunishmentType.Mute]: (
  findWhere: Parameters<(typeof client.util)['DataBase']['punish_mutes']['findMany']>[0],
 ) => client.util.DataBase.punish_mutes.findMany(findWhere),
 [CT.PunishmentType.Kick]: (
  findWhere: Parameters<(typeof client.util)['DataBase']['punish_kicks']['findMany']>[0],
 ) => client.util.DataBase.punish_kicks.findMany(findWhere),
 [CT.PunishmentType.Ban]: (
  findWhere: Parameters<(typeof client.util)['DataBase']['punish_bans']['findMany']>[0],
 ) => client.util.DataBase.punish_bans.findMany(findWhere),
 [CT.PunishmentType.Channelban]: (
  findWhere: Parameters<(typeof client.util)['DataBase']['punish_channelbans']['findMany']>[0],
 ) => client.util.DataBase.punish_channelbans.findMany(findWhere),
};

const expire = async (row: { expire: Prisma.Decimal; guildid: string }, tableName: TableName) => {
 const findWhere = {
  where: {
   guildid: row.guildid,
   uniquetimestamp: { lt: Math.abs(Date.now() - Number(row.expire) * 1000) },
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
   [CT.PunishmentType.Warn]: () => client.util.DataBase.punish_warns.deleteMany(deleteWhere),
   [CT.PunishmentType.Mute]: () => client.util.DataBase.punish_mutes.deleteMany(deleteWhere),
   [CT.PunishmentType.Kick]: () => client.util.DataBase.punish_kicks.deleteMany(deleteWhere),
   [CT.PunishmentType.Ban]: () => client.util.DataBase.punish_bans.deleteMany(deleteWhere),
   [CT.PunishmentType.Channelban]: () =>
    client.util.DataBase.punish_channelbans.deleteMany(deleteWhere),
  };
  deleteTable[tableName]().then();
 });

 logExpire<TableName>(tableRows, row.guildid);
};

const logExpire = async <T extends TableName>(
 rows: T extends CT.PunishmentType.Warn
  ? CT.DePromisify<ReturnType<(typeof client.util)['DataBase']['punish_warns']['findMany']>>
  : T extends CT.PunishmentType.Mute
    ? CT.DePromisify<ReturnType<(typeof client.util)['DataBase']['punish_mutes']['findMany']>>
    : T extends CT.PunishmentType.Kick
      ? CT.DePromisify<ReturnType<(typeof client.util)['DataBase']['punish_kicks']['findMany']>>
      : T extends CT.PunishmentType.Ban
        ? CT.DePromisify<ReturnType<(typeof client.util)['DataBase']['punish_bans']['findMany']>>
        : T extends CT.PunishmentType.Channelban
          ? CT.DePromisify<
             ReturnType<(typeof client.util)['DataBase']['punish_channelbans']['findMany']>
            >
          : never,
 guildid: string,
) => {
 const guild = client.guilds.cache.get(guildid);
 if (!guild) return;

 const channels = await client.util.getLogChannels('modlog', guild);
 if (!channels) return;

 await Promise.all(
  rows.map((p) =>
   client.util.request.guilds
    .getMember(guild, p.userid)
    .then((m) => ('message' in m ? undefined : m)),
  ),
 );
 await Promise.all(rows.map((p) => client.util.getUser(p.userid).catch(() => null)));

 const language = await client.util.getLanguage(guildid);
 const lan = language.expire;

 const users = await Promise.all(rows.map((r) => client.util.getUser(r.userid)));

 const embeds: (Discord.APIEmbed | undefined)[] = rows.map((p) => {
  const user = users.find((u) => u?.id === p.userid);
  if (!user) return undefined;
  if (!client.user) return undefined;

  const embed: Discord.APIEmbed = {
   description: `**${language.t.Reason}:**\n${p.reason}`,
   author: {
    name: lan.punishmentOf(user),
    url: `https://discord.com/channels/${guild.id}/${p.channelid}/${p.msgid}`,
   },
   color: CT.Colors.Success,
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
    client.util.constants.standard.getTime(Number(p.uniquetimestamp) + Number(p.duration)),
   );

   embed.fields?.push(
    {
     name: lan.duration,
     value: `${p.duration ? client.util.moment(Number(p.duration), language) : '∞'}`,
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
  .forEach((e) => client.util.send({ id: channels, guildId: guild.id }, { embeds: [e] }, 10000));
};
