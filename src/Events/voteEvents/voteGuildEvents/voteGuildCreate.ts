import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings';
import type CT from '../../../Typings/CustomTypings';

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
    doAnnouncement(settings, member, language);
    return;
  }

  const tier = getTier(allRewards, member);
  const rewards = allRewards.filter((r) => Number(r.tier) === tier);

  rewards.forEach((r) => {
    switch (r.rewardtype) {
      case 'currency': {
        ch.query(
          `INSERT INTO balance (userid, guildid, balance) VALUES ($1, $2, $3) ON CONFLICT (userid, guildid) DO UPDATE SET balance = balance + $3;`,
          [user.id, guild.id, Number(r.reward)],
        );

        break;
      }
      case 'role': {
        if (!member.manageable) return;
        if (!r.reward) return;

        const role = guild.roles.cache.get(r.reward);
        if (!role) return;

        ch.roleManager.add(member, [role.id], language.events.vote.guildReason(guild), 1);
        break;
      }
      case 'xp': {
        ch.query(
          `INSERT INTO level (userid, guildid, type, xp, level) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (userid, guildid, type) DO UPDATE SET xp = xp + $4;`,
          [user.id, guild.id, 'guild', Number(r.reward), 0],
        );

        break;
      }
      case 'xpmultiplier': {
        ch.query(
          `INSERT INTO level (userid, guildid, type, xp, level) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (userid, guildid, type) DO UPDATE SET xp = xp + $4;`,
          [user.id, guild.id, 'guild', Number(r.reward), 0],
        );

        break;
      }
      default: {
        break;
      }
    }
  });

  const rewardTypes = rewards.map((r) => r.rewardtype);
  const rewardStrings = rewards.map((r) => r.reward);

  await ch.query(
    `INSERT INTO voters (userid, removetime, voted, votedtype, tier, rewardtype, reward) VALUE ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT(userid, voted) DO NOTHING;`,
    [user.id, Date.now() + 43200000, vote.guild, 'guild', tier, rewardTypes, rewardStrings],
  );

  Jobs.scheduleJob(new Date(Date.now() + 43200000), () => endVote(vote, guild));
};

const getTier = (rewards: DBT.voterewards[], member: Discord.GuildMember) => {
  const doesntHave = rewards
    .filter((r) => r.rewardtype === 'role')
    .sort((a, b) => Number(a.tier) - Number(b.tier))
    .find((r) => !member.roles.cache.has(r.reward));

  const highestTier = Math.max(...rewards.map((r) => Number(r.tier)));

  if (doesntHave) {
    if (Number(doesntHave.tier) > highestTier) return Number(highestTier);
    return Number(doesntHave.tier);
  }

  return 1;
};

const doAnnouncement = async (
  settings: DBT.votesettings,
  member: Discord.GuildMember,
  language: CT.Language,
  rewards?: DBT.voterewards[],
) => {
  if (!settings.announcementchannel) return;

  const channel = await ch.getChannel.guildTextChannel(settings.announcementchannel);
  if (!channel) return;

  const currencyRewards = rewards?.filter((r) => r.rewardtype === 'currency');
  const lan = language.events.vote;

  const rewardText = rewards?.length
    ? `${lan.reward(
        rewards
          .map((r) => {
            if (!r.reward) return null;

            switch (r.rewardtype) {
              case 'role': {
                return `<@&${r.reward}>`;
              }
              case 'xp': {
                return `${r.reward} XP`;
              }
              case 'xpmultiplier': {
                return `${r.reward}x ${lan.xpmultiplier}`;
              }
              default: {
                return null;
              }
            }
          })
          .join(` ${ch.stringEmotes.plusBG} `),
      )}${
        currencyRewards?.length
          ? `${ch.stringEmotes.plusBG} ${currencyRewards
              ?.map((r) => Number(r.reward))
              .reduce((b, a) => b + a, 0)} ${ch.stringEmotes.book}`
          : ''
      }`
    : '';

  ch.send(channel, { content: `${lan.guild(member.user, member.guild)}${rewardText}` });
};

const getSettings = async (guild: Discord.Guild) =>
  ch
    .query(`SELECT * FROM votesettings WHERE guildid = $1;`, [guild.id])
    .then((r: DBT.votesettings[] | null) => (r ? r[0] : null));

const endVote = async (vote: CT.TopGGGuildVote, g: Discord.Guild) => {
  const now = Date.now();
  const savedRewards = await ch
    .query(`SELECT * FROM voters WHERE userid = $1 AND voted = $2 AND removetime < $3;`, [
      vote.user,
      vote.guild,
      now,
    ])
    .then((r: DBT.voters[] | null) => r ?? null);
  if (!savedRewards) return;

  await ch.query(`DELETE FROM voters WHERE userid = $1 AND voted = $2 AND removetime < $3;`, [
    vote.user,
    vote.guild,
    now,
  ]);

  const guild = client.guilds.cache.get(g.id);
  if (!guild) return;

  const member = await guild.members.fetch(vote.user).catch(() => undefined);
  if (!member) return;

  const language = await ch.languageSelector(guild.id);
  const lan = language.events.vote;

  const rolesToRemove = savedRewards
    ?.map((r) => {
      const roleRewards = r.rewardtype
        .map((rewardtype, i) => (rewardtype === 'role' ? i : undefined))
        .filter((index): index is number => index !== undefined);
      const roles = roleRewards
        .map((rewardIndex) => guild.roles.cache.get(r.reward[rewardIndex]))
        .filter((role): role is Discord.Role => !!role)
        .filter((role) => member.roles.cache.has(role.id));

      return roles;
    })
    .flat();

  ch.roleManager.remove(
    member,
    rolesToRemove.map((r) => r.id),
    language.events.vote.endReason,
    1,
  );

  const userSettings = await ch
    .query(`SELECT * FROM users WHERE userid = $1;`, [member.user.id])
    .then((r: DBT.users[] | null) => (r ? r[0] : null));
  if (userSettings && !userSettings.votereminders) return;

  const dm = await member.user.createDM().catch(() => undefined);
  if (!dm) return;

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.reminder.name,
      icon_url: ch.objectEmotes.userFlags.EarlySupporter.link,
    },
    color: ch.constants.colors.base,
    description: lan.reminder.descGuild(guild),
    fields: [
      {
        name: '\u200b',
        value: lan.reminder.voteGuild(guild),
      },
    ],
  };

  dm.send({
    embeds: [embed],
    components: [
      {
        type: Discord.ComponentType.ActionRow,
        components: [
          {
            type: Discord.ComponentType.Button,
            style: Discord.ButtonStyle.Link,
            label: lan.reminder.voteGuildButton(guild),
            url: `https://top.gg/servers/${guild.id}/vote`,
          },
          {
            type: Discord.ComponentType.Button,
            style: Discord.ButtonStyle.Link,
            label: lan.reminder.voteAyakoButton,
            url: `https://top.gg/bot/${client.user?.id}/vote`,
          },
        ],
      },
      {
        type: Discord.ComponentType.ActionRow,
        components: [
          {
            type: Discord.ComponentType.Button,
            style: Discord.ButtonStyle.Danger,
            label: lan.reminder.disable,
            custom_id: `voteReminder_guild_disable_${vote.guild}`,
          },
        ],
      },
    ],
  });
};
