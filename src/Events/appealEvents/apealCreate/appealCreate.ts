import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import * as CT from '../../../Typings/CustomTypings';
import * as DBT from '../../../Typings/DataBaseTypings';

export default async (appeal: CT.Appeal) => {
 const settings = await ch.query(
  `SELECT * FROM appealsettings WHERE guildid = $1 AND active = true;`,
  [appeal.guildid],
  {
   returnType: 'appealsettings',
   asArray: false,
  },
 );
 if (!settings) return;
 if (!settings.channelid) return;
 if (settings.blusers?.includes(appeal.userid)) return;

 const punishment = await ch.query(
  `WITH user_punishments AS (
        SELECT guildid, reason, channelname, channelid, uniquetimestamp, 'ban' as type FROM punish_bans WHERE uniquetimestamp = $1
        UNION ALL
        SELECT guildid, reason, channelname, channelid, uniquetimestamp, 'channelban' as type FROM punish_channelbans WHERE uniquetimestamp = $1
        UNION ALL
        SELECT guildid, reason, channelname, channelid, uniquetimestamp, 'kick' as type FROM punish_kicks WHERE uniquetimestamp = $1
        UNION ALL
        SELECT guildid, reason, channelname, channelid, uniquetimestamp, 'mute' as type FROM punish_mutes WHERE uniquetimestamp = $1
        UNION ALL
        SELECT guildid, reason, channelname, channelid, uniquetimestamp, 'warn' as type FROM punish_warns WHERE uniquetimestamp = $1  
      ) SELECT * FROM user_punishments;`,
  [appeal.punishmentid],
  { returnType: 'Punishment', asArray: false },
 );
 if (!punishment) return;

 const guild = client.guilds.cache.get(appeal.guildid);
 if (!guild) return;

 const channel = await ch.getChannel.guildTextChannel(settings.channelid);
 if (!channel) return;

 const user = await ch.getUser(appeal.userid).catch(() => undefined);
 if (!user) return;

 const language = await ch.languageSelector(guild.id);
 const lan = language.events.appeal;

 const embed = {
  title: lan.title,
  description: lan.description(user, punishment),
  color: ch.colorSelector(guild.members.me),
  fields: appeal.questions.map((q, i) => {
   const answer = appeal.answers[i];
   const answertype = appeal.answertypes[i];
   const displayAnswer = getDisplayAnswer(answer, answertype);

   return {
    name: q,
    value: displayAnswer,
    inline: answertype ? !['paragraph', 'short'].includes(answertype) : true,
   };
  }),
  author: {
   name: lan.author,
  },
 };

 ch.send(channel, { embeds: [embed] });
};

const getDisplayAnswer = (answer: string, answertype: DBT.appealquestions['answertype']) => {
 switch (answertype) {
  case 'number':
   return answer;
  case 'boolean':
   // eslint-disable-next-line no-extra-boolean-cast
   return Boolean(answer)
    ? ch.stringEmotes.tickWithBackground
    : ch.stringEmotes.crossWithBackground;
  case 'multiple choice':
   return `\`${answer
    .split(',')
    .map((a) => a.trim())
    .join('`, `')}\``;
  case 'single choice':
   return `\`${answer}\``;
  default:
   return answer;
 }
};
