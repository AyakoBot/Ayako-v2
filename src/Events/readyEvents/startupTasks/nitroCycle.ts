import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings';

export default async () => {
  client.guilds.cache.forEach(async (guild) => {
    if (!guild.available) return;
    if (!guild.roles.cache.find((r) => r.tags?.premiumSubscriberRole === true)) return;

    const addedMembers: Discord.GuildMember[] = [];
    const removedMembers: Discord.GuildMember[] = [];

    const nitrousersRows = await ch
      .query(`SELECT * FROM nitrousers WHERE guildid = $1;`, [guild.id])
      .then((r: DBT.nitrousers[] | null) => r || null);
    if (!nitrousersRows) return;

    nitrousersRows.forEach((row) => {
      if (!row.boostend && !guild.members.cache.get(row.userid)?.premiumSince) {
        if (!row.userid) return;

        ch.query(
          `UPDATE nitrousers SET boostend = $1 WHERE guildid = $2 AND userid = $3 AND booststart = $4;`,
          [Date.now(), guild.id, row.userid, row.booststart],
        );

        const member = guild.members.cache.get(row.userid);
        if (!member) return;
        removedMembers.push(member);
      }
    });

    guild.members.cache.forEach((member) => {
      if (!member) return;

      if (member.premiumSince) {
        if (!nitrousersRows) {
          ch.query(
            `INSERT INTO nitrousers (guildid, userid, booststart) VALUES ($1, $2, $3) ON CONFLICT (booststart) DO NOTHING;`,
            [guild.id, member.id, member.premiumSinceTimestamp],
          );

          addedMembers.push(member);
        } else {
          const row = nitrousersRows.find(
            (r) =>
              r.userid === member.user.id && Number(r.booststart) === member.premiumSinceTimestamp,
          );

          if (!row) {
            ch.query(
              `INSERT INTO nitrousers (guildid, userid, booststart) VALUES ($1, $2, $3) ON CONFLICT (booststart) DO NOTHING;`,
              [guild.id, member.id, member.premiumSinceTimestamp],
            );

            if (!member) return;
            addedMembers.push(member);
          }
        }
      }
    });

    [...new Set(addedMembers)].forEach((m) => logStart(m, guild));
    [...new Set(removedMembers)].forEach((m) => logEnd(m, guild));
  });
};

const logEnd = async (member: Discord.GuildMember, guild: Discord.Guild) => {
  const row = await getSettings(guild);
  if (!row?.logchannels || !row.logchannels.length) return;

  const language = await ch.languageSelector(guild.id);

  const embed: Discord.APIEmbed = {
    author: {
      name: language.events.guildMemberUpdate.boostingEnd,
    },
    description: language.events.guildMemberUpdate.descriptionBoostingEnd(member.user),
    color: ch.constants.colors.loading,
  };

  ch.send({ id: row.logchannels, guildId: guild.id }, { embeds: [embed] }, undefined, 10000);
};

const logStart = async (member: Discord.GuildMember, guild: Discord.Guild) => {
  const row = await getSettings(guild);
  if (!row?.logchannels || !row.logchannels.length) return;

  const language = await ch.languageSelector(guild.id);

  const embed: Discord.APIEmbed = {
    author: {
      name: language.events.guildMemberUpdate.boostingStart,
    },
    description: language.events.guildMemberUpdate.descriptionBoostingStart(member.user),
    color: ch.constants.colors.loading,
  };

  ch.send({ id: row.logchannels, guildId: guild.id }, { embeds: [embed] }, undefined, 10000);
};

const getSettings = async (guild: Discord.Guild) =>
  ch
    .query(`SELECT * FROM nitrosettings WHERE guildid = $1 AND active = true;`, [guild.id])
    .then((r: DBT.nitrosettings[] | null) => (r ? r[0] : null));
