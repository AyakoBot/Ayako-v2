import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (appeal: CT.Appeal) => {
 const settings = await ch.DataBase.appealsettings.findUnique({
  where: { guildid: appeal.guildid, active: true },
 });
 if (!settings) return;
 if (!settings.channelid) return;
 if (settings.bluserid?.includes(appeal.userid)) return;

 const where = { where: { uniquetimestamp: appeal.punishmentid } };

 const punishment = (
  await Promise.all([
   ch.DataBase.punish_bans.findUnique(where).then((p) => ({ ...p, type: 'ban' })),
   ch.DataBase.punish_channelbans.findUnique(where).then((p) => ({ ...p, type: 'channelban' })),
   ch.DataBase.punish_kicks.findUnique(where).then((p) => ({ ...p, type: 'kick' })),
   ch.DataBase.punish_mutes.findUnique(where).then((p) => ({ ...p, type: 'mute' })),
   ch.DataBase.punish_warns.findUnique(where).then((p) => ({ ...p, type: 'warn' })),
  ])
 )[0];

 if (!punishment || !punishment.uniquetimestamp) return;

 const guild = client.guilds.cache.get(appeal.guildid);
 if (!guild) return;

 const channel = await ch.getChannel.guildTextChannel(settings.channelid);
 if (!channel) return;

 const user = await ch.getUser(appeal.userid).catch(() => undefined);
 if (!user) return;

 const language = await ch.getLanguage(guild.id);
 const lan = language.events.appeal;

 const embed: Discord.APIEmbed = {
  title: lan.title,
  description: lan.description(
   user,
   String(punishment.uniquetimestamp),
   (await ch.getCustomCommand(guild, 'check'))?.id ?? '0',
  ),
  color: ch.getColor(await ch.getBotMemberFromGuild(guild)),
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

const getDisplayAnswer = (
 answer: string,
 answertype: Prisma.appealquestions['answertype'],
): string => {
 switch (answertype) {
  case 'number':
   return answer;
  case 'boolean':
   // eslint-disable-next-line no-extra-boolean-cast
   return Boolean(answer)
    ? ch.constants.standard.getEmote(ch.emotes.tickWithBackground)
    : ch.constants.standard.getEmote(ch.emotes.crossWithBackground);
  case 'multiple_choice':
   return `\`${answer
    .split(',')
    .map((a) => a.trim())
    .join('`, `')}\``;
  case 'single_choice':
   return `\`${answer}\``;
  default:
   return answer;
 }
};
