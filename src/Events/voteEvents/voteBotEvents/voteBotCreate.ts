import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings';
import type CT from '../../../Typings/CustomTypings';

export default async (
 vote: CT.TopGGBotVote,
 guild: Discord.Guild,
 user: Discord.User | CT.bEvalUser,
 member: Discord.GuildMember | undefined,
) => {
 const settings = await getSettings(guild);
 if (!settings) return;

 const allRewards = await ch.query(`SELECT * FROM voterewards WHERE guildid = $1;`, [guild.id], {
  returnType: 'voterewards',
  asArray: true,
 });

 const bot = await ch.getUser(vote.bot).catch(() => undefined);
 if (!bot) return;

 const language = await ch.languageSelector(guild.id);

 if (!allRewards?.length) {
  doAnnouncement(settings, user, bot, language);
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
   if (!member?.manageable) return;
   if (!r.rewardroles?.length) return;

   ch.roleManager.add(member, r.rewardroles, language.events.vote.botReason(bot), 1);
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
    vote.bot,
    'bot',
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

export const getTier = (rewards: DBT.voterewards[], member: Discord.GuildMember | undefined) => {
 if (!member) return 1;

 const doesntHave = rewards
  .filter((r) => r.rewardroles?.length)
  .sort((a, b) => Number(a.tier) - Number(b.tier))
  .find((r) => !member.roles.cache.hasAny(...(r.rewardroles as string[])));

 const highestTier = Math.max(...rewards.map((r) => Number(r.tier)));

 if (doesntHave) {
  if (Number(doesntHave.tier) > highestTier) return Number(highestTier);
  return Number(doesntHave.tier);
 }

 return 1;
};

export const doAnnouncement = async (
 settings: DBT.votesettings,
 user: Discord.User | CT.bEvalUser,
 voted: Discord.User | CT.bEvalUser | Discord.Guild,
 language: CT.Language,
 rewards?: DBT.voterewards[],
) => {
 if (!settings.announcementchannel) return;

 const channel = await ch.getChannel.guildTextChannel(settings.announcementchannel);
 if (!channel) return;

 const currencyRewards = rewards?.filter((r) => !!r.rewardcurrency);
 const lan = language.events.vote;

 const rewardText = rewards?.length
  ? `${lan.reward(
     rewards
      .map((r, i) => {
       switch (i) {
        case 0 && r.rewardroles?.length: {
         return r.rewardroles?.map((roleID) => `<@&${roleID}>`).join(', ');
        }
        case 1: {
         return `${r.rewardxp} XP`;
        }
        case 2: {
         return `${r.rewardxpmultiplier}x ${lan.xpmultiplier}`;
        }
        default: {
         return null;
        }
       }
      })
      .filter((r): r is string => !!r)
      .join(` ${ch.stringEmotes.plusBG} `),
    )}${
     currencyRewards?.length
      ? `${ch.stringEmotes.plusBG} ${currencyRewards
         ?.map((r) => Number(r.rewardcurrency))
         .reduce((b, a) => b + a, 0)} ${ch.stringEmotes.book}`
      : ''
    }`
  : '';

 ch.send(channel, {
  content: `${'username' in voted ? lan.bot(user, voted) : lan.guild(user, voted)}${rewardText}`,
 });
};

export const getSettings = async (guild: Discord.Guild) =>
 ch.query(`SELECT * FROM votesettings WHERE guildid = $1;`, [guild.id], {
  returnType: 'votesettings',
  asArray: false,
 });

export const endVote = async (vote: CT.TopGGBotVote | CT.TopGGGuildVote, g: Discord.Guild) => {
 const now = Date.now();
 const savedRewards = await ch.query(
  `SELECT * FROM voters WHERE userid = $1 AND voted = $2 AND removetime < $3;`,
  [vote.user, 'bot' in vote ? vote.bot : vote.guild, now],
  {
   returnType: 'voters',
   asArray: true,
  },
 );
 if (!savedRewards) return;

 await ch.query(`DELETE FROM voters WHERE userid = $1 AND voted = $2 AND removetime < $3;`, [
  vote.user,
  'bot' in vote ? vote.bot : vote.guild,
  now,
 ]);

 const guild = client.guilds.cache.get(g.id);
 if (!guild) return;

 const member = await guild.members.fetch(vote.user).catch(() => undefined);
 if (!member) return;

 const language = await ch.languageSelector(guild.id);
 const lan = language.events.vote;

 ch.roleManager.remove(
  member,
  savedRewards
   .filter((r) => r.rewardroles?.length)
   .map((r) => r.rewardroles)
   .filter((r): r is string[] => !!r)
   .flat(),
  language.events.vote.endReason,
  1,
 );

 const userSettings = await ch.query(`SELECT * FROM users WHERE userid = $1;`, [member.user.id], {
  returnType: 'users',
  asArray: false,
 });
 if (userSettings && !userSettings.votereminders) return;

 const voted =
  'bot' in vote ? await ch.getUser(vote.bot).catch(() => undefined) : client.guilds.cache.get(g.id);
 if (!voted) return;

 const dm = await member.user.createDM().catch(() => undefined);
 if (!dm) return;

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.reminder.name,
   icon_url: ch.objectEmotes.userFlags.EarlySupporter.link,
  },
  color: ch.constants.colors.base,
  description: 'username' in voted ? lan.reminder.descBot(voted) : lan.reminder.descGuild(voted),
  fields: [
   {
    name: '\u200b',
    value: 'username' in voted ? lan.reminder.voteBot(voted) : lan.reminder.voteGuild(voted),
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
      label:
       'username' in voted
        ? lan.reminder.voteBotButton(voted)
        : lan.reminder.voteGuildButton(voted),
      url:
       'username' in voted
        ? `https://top.gg/bot/${voted.id}/vote`
        : `https://top.gg/servers/${guild.id}/vote`,
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
      custom_id: `voteReminder_${'bot' in vote ? 'bot' : 'guild'}_disable_${voted.id}`,
     },
    ],
   },
  ],
 });
};
