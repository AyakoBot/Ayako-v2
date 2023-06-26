import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings';

export default async () => {
 const settingsRows = await ch.query(
  `SELECT * FROM expiry WHERE warns = true AND warnstime IS NOT NULL OR mutes = true AND mutestime IS NOT NULL OR kicks = true AND kickstime IS NOT NULL OR channelbans = true AND channelbanstime IS NOT NULL OR bans = true AND banstime IS NOT NULL;`,
  undefined,
  {
   returnType: 'expiry',
   asArray: true,
  },
 );

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

const expire = async (row: { expire: string; guildid: string }, tableName: string) => {
 const tableRows = await ch.query(
  `SELECT * FROM ${tableName} WHERE guildid = $1 AND uniquetimestamp < $2;`,
  [row.guildid, Math.abs(Date.now() - Number(row.expire))],
  {
   returnType: 'Punishment',
   asArray: true,
  },
 );

 if (!tableRows) return;

 tableRows.forEach((r) => {
  ch.query(`DELETE FROM ${tableName} WHERE uniquetimestamp = $1 AND guildid = $2;`, [
   r.uniquetimestamp,
   r.guildid,
  ]);
 });

 logExpire(tableRows, row.guildid);
};

const logExpire = async (rows: (DBT.Punishment | DBT.TempPunishment)[], guildid: string) => {
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
     value: `<t:${p.uniquetimestamp.slice(0, -3)}:F> (<t:${p.uniquetimestamp.slice(0, -3)}:R>)`,
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
