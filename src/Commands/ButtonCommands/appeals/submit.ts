import { AnswerType } from '@prisma/client';
import {
 ButtonStyle,
 Client,
 ComponentType,
 inlineCode,
 type APIEmbed,
 type ButtonInteraction,
} from 'discord.js';
import { runAppeal } from '../../../Commands/SlashCommands/appeal.js';

export default async (cmd: ButtonInteraction, args: string[]) => {
 const punishmentid = Number(args.shift() as string);

 await appeal(cmd.client, punishmentid);

 runAppeal(cmd, punishmentid);
};

export const appeal = async (client: Client, punishmentid: number) => {
 const punishment = await getPunishment(client, { uniquetimestamp: punishmentid });
 if (!punishment) return;

 await client.util.DataBase.appeals.upsert({
  where: { punishmentid },
  update: { received: true },
  create: { punishmentid, received: true, guildid: punishment.guildid, userid: punishment.userid },
 });

 const settings = await client.util.DataBase.appealsettings.findUnique({
  where: { guildid: punishment.guildid, active: true },
 });
 if (!settings) return;
 if (!settings.channelid) return;
 if (settings.bluserid?.includes(punishment.userid)) return;

 const guild = client.guilds.cache.get(punishment.guildid);
 if (!guild) return;

 client.util.firstGuildInteraction(guild, 'appealCreate');

 const channel = await client.util.getChannel.guildTextChannel(settings.channelid);
 if (!channel) return;

 const user = await client.util.getUser(punishment.userid).catch(() => undefined);
 if (!user) return;

 const language = await client.util.getLanguage(guild.id);
 const lan = language.events.appeal;

 const appealAnswers = await client.util.DataBase.appealanswers.findMany({
  where: { punishmentid: String(punishmentid) },
 });
 const questions = await client.util.DataBase.appealquestions.findMany({
  where: { guildid: punishment.guildid },
 });

 const embed: APIEmbed = {
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
       return a.multiplechoice.map((o) => inlineCode(o.replace(/`/g, '\\`'))).join(', ');
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
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.Button,
      style: ButtonStyle.Danger,
      label: lan.reject,
      custom_id: `appeals/reject_${punishmentid}`,
     },
     {
      type: ComponentType.Button,
      style: ButtonStyle.Success,
      label: lan.accept,
      custom_id: `appeals/accept_${punishmentid}`,
     },
    ],
   },
  ],
 });
};

export const getPunishment = async (
 client: Client,
 where: Parameters<typeof client.util.DataBase.punishments.findUnique>[0]['where'],
) =>
 client.util.DataBase.punishments.findUnique({
  where,
 });
