import { AnswerType } from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../BaseClient/Bot/Client.js';
import * as CT from '../../Typings/Typings.js';

export default async ({ data }: CT.Message<CT.MessageType.Appeal>) => {
 await client.util.DataBase.appeals.update({
  where: { punishmentid: data.punishmentId },
  data: { received: true },
 });

 const settings = await client.util.DataBase.appealsettings.findUnique({
  where: { guildid: data.guildId, active: true },
 });
 if (!settings) return;
 if (!settings.channelid) return;
 if (settings.bluserid?.includes(data.userId)) return;

 const punishment = await getPunishment(data);
 if (!punishment) return;

 const guild = client.guilds.cache.get(data.guildId);
 if (!guild) return;

 await client.util.firstGuildInteraction(guild, 'appealCreate');

 const channel = await client.util.getChannel.guildTextChannel(settings.channelid);
 if (!channel) return;

 const user = await client.util.getUser(data.userId).catch(() => undefined);
 if (!user) return;

 const language = await client.util.getLanguage(guild.id);
 const lan = language.events.appeal;

 const appealAnswers = await client.util.DataBase.appealanswers.findMany({
  where: { punishmentid: data.punishmentId },
 });
 const questions = await client.util.DataBase.appealquestions.findMany({
  where: { guildid: data.guildId },
 });

 const embed: Discord.APIEmbed = {
  title: lan.title,
  description: lan.description(
   user,
   String(punishment.uniquetimestamp),
   (await client.util.getCustomCommand(guild, 'check'))?.id ?? '0',
  ),
  color: client.util.getColor(await client.util.getBotMemberFromGuild(guild)),
  fields: appealAnswers
   .map((a) => {
    const question = questions.find((q) => String(q.uniquetimestamp) === String(a.questionid));
    if (!question) return undefined;

    const getAnswer = () => {
     switch (a.type) {
      case AnswerType.boolean:
       return a.boolean
        ? client.util.constants.standard.getEmote(client.util.emotes.tickWithBackground)
        : client.util.constants.standard.getEmote(client.util.emotes.crossWithBackground);
      case AnswerType.multiple_choice:
       return a.multiplechoice.map((o) => Discord.inlineCode(o.replace(/`/g, '\\`'))).join(', ');
      case AnswerType.number:
       return String(a.number);
      case AnswerType.paragraph:
      case AnswerType.short:
      case AnswerType.single_choice:
       return a.string;
      default:
       return undefined;
     }
    };

    const getInline = () => {
     switch (a.type) {
      case AnswerType.short:
      case AnswerType.boolean:
      case AnswerType.number:
      case AnswerType.single_choice:
       return true;
      case AnswerType.paragraph:
      case AnswerType.multiple_choice:
      default:
       return false;
     }
    };

    return {
     name: question?.question,
     value: getAnswer(),
     inline: getInline(),
    };
   })
   .filter((f): f is { name: string; value: string; inline: boolean } => !!f?.value),
  author: { name: lan.author },
 };

 client.util.send(channel, {
  embeds: [embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Danger,
      label: lan.reject,
      custom_id: `appeals/reject_${data.punishmentId}`,
     },
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Success,
      label: lan.accept,
      custom_id: `appeals/accept_${data.punishmentId}`,
     },
    ],
   },
  ],
 });
};

export const getPunishment = async ({ punishmentId }: CT.Appeal) =>
 client.util.DataBase.punishments.findUnique({
  where: { uniquetimestamp: Number(punishmentId) },
 });
