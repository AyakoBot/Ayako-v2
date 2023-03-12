import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type DBT from '../../../Typings/DataBaseTypings';
import type CT from '../../../Typings/CustomTypings';
import { doAnnouncement, getSettings, getTier, endVote } from '../voteBotEvents/voteBotCreate.js';

export default async (
  vote: CT.TopGGGuildVote,
  guild: Discord.Guild,
  user: Discord.User,
  member: Discord.GuildMember,
) => {
  const settings = await getSettings(guild);
  if (!settings) return;

  const allRewards = await ch
    .query(`SELECT * FROM voterewards WHERE guildid = $1;`, [guild.id])
    .then((r: DBT.voterewards[] | null) => r ?? null);

  const language = await ch.languageSelector(member.guild.id);

  if (!allRewards?.length) {
    doAnnouncement(settings, member, guild, language);
    return;
  }

  const tier = getTier(allRewards, member);
  const rewards = allRewards.filter((r) => Number(r.tier) === tier);

  rewards.forEach((r) => {
    const currency = () => {
      if (!r.rewardcurrency) return;

      ch.query(
        `INSERT INTO balance (userid, guildid, balance) VALUES ($1, $2, $3) ON CONFLICT (userid, guildid) DO UPDATE SET balance = balance + $3;`,
        [user.id, guild.id, Number(r.rewardcurrency)],
      );
    };

    const roles = () => {
      if (!member.manageable) return;
      if (!r.rewardroles?.length) return;

      ch.roleManager.add(member, r.rewardroles, language.events.vote.guildReason(guild), 1);
    };

    const xp = () => {
      if (!r.rewardxp) return;

      ch.query(
        `INSERT INTO level (userid, guildid, type, xp, level) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (userid, guildid, type) DO UPDATE SET xp = xp + $4;`,
        [user.id, guild.id, 'guild', Number(r.rewardxp), 0],
      );
    };

    const xpmultiplier = () => {
      if (!r.rewardxpmultiplier) return;

      ch.query(
        `INSERT INTO level (userid, guildid, type, xp, level) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (userid, guildid, type) DO UPDATE SET xp = xp + $4;`,
        [user.id, guild.id, 'guild', Number(r.rewardxpmultiplier), 0],
      );
    };

    currency();
    roles();
    xp();
    xpmultiplier();

    ch.query(
      `INSERT INTO voters (userid, removetime, voted, votedtype, tier, rewardroles, rewardxp, rewardcurrency, rewardxpmultiplier) VALUE ($1, $2, $3, $4, $5, $6, $7) 
      ON CONFLICT(userid, voted) DO UPDATE SET voters.rewardxp + $7, voters.rewardcurrency + $8, voters.rewardxpmultiplier + $9, COALESCE(ARRAY_CAT(voters.rewardroles, $6), $6);`,
      [
        user.id,
        Date.now() + 43200000,
        vote.guild,
        'guild',
        tier,
        r.rewardroles,
        r.rewardxp,
        r.rewardcurrency,
        r.rewardxpmultiplier,
      ],
    );
  });

  Jobs.scheduleJob(new Date(Date.now() + 43200000), () => endVote(vote, guild));
};
