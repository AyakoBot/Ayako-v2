import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import * as CT from '../../../Typings/Typings.js';

export default async (appeal: CT.Appeal) => {
 const settings = await client.util.DataBase.appealsettings.findUnique({
  where: { guildid: appeal.guildid, active: true },
 });
 if (!settings) return;
 if (!settings.channelid) return;
 if (settings.bluserid?.includes(appeal.userid)) return;

 const where = { where: { uniquetimestamp: appeal.punishmentid } };

 const punishment = (
  await Promise.all([
   client.util.DataBase.punish_bans.findUnique(where).then((p) => ({ ...p, type: 'ban' })),
   client.util.DataBase.punish_channelbans
    .findUnique(where)
    .then((p) => ({ ...p, type: 'channelban' })),
   client.util.DataBase.punish_kicks.findUnique(where).then((p) => ({ ...p, type: 'kick' })),
   client.util.DataBase.punish_mutes.findUnique(where).then((p) => ({ ...p, type: 'mute' })),
   client.util.DataBase.punish_warns.findUnique(where).then((p) => ({ ...p, type: 'warn' })),
  ])
 )[0];

 if (!punishment || !punishment.uniquetimestamp) return;

 const guild = client.guilds.cache.get(appeal.guildid);
 if (!guild) return;

 await client.util.firstGuildInteraction(guild);

 const channel = await client.util.getChannel.guildTextChannel(settings.channelid);
 if (!channel) return;

 const user = await client.util.getUser(appeal.userid).catch(() => undefined);
 if (!user) return;

 const language = await client.util.getLanguage(guild.id);
 const lan = language.events.appeal;

 const embed: Discord.APIEmbed = {
  title: lan.title,
  description: lan.description(
   user,
   String(punishment.uniquetimestamp),
   (await client.util.getCustomCommand(guild, 'check'))?.id ?? '0',
  ),
  color: client.util.getColor(await client.util.getBotMemberFromGuild(guild)),
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

 client.util.send(channel, { embeds: [embed] });
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
    ? client.util.constants.standard.getEmote(client.util.emotes.tickWithBackground)
    : client.util.constants.standard.getEmote(client.util.emotes.crossWithBackground);
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
