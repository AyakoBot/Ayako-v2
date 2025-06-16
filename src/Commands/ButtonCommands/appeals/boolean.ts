import { type ButtonInteraction } from 'discord.js';
import { runAppeal } from '../../SlashCommands/appeal.js';

export default async (cmd: ButtonInteraction, args: string[]) => {
 const language = await cmd.client.util.getLanguage(cmd.locale);

 if (!cmd.isMessageComponent()) return;

 const questionId = args.shift()!;
 const punishmentId = args.shift()!;

 const question = await cmd.client.util.DataBase.appealquestions.findUnique({
  where: { uniquetimestamp: Number(questionId) },
 });
 if (!question) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.appeal.questionNotFound, language);
  return;
 }

 const prevAnswer = await cmd.client.util.DataBase.appealanswers.findUnique({
  where: {
   punishmentid_questionid: { questionid: question.uniquetimestamp, punishmentid: punishmentId },
  },
 });

 await cmd.client.util.DataBase.appealanswers.upsert({
  where: {
   punishmentid_questionid: { questionid: question.uniquetimestamp, punishmentid: punishmentId },
  },
  update: { boolean: !(prevAnswer?.boolean || false) },
  create: {
   questionid: question.uniquetimestamp,
   punishmentid: punishmentId,
   boolean: !(prevAnswer?.boolean || false),
   type: question.answertype,
  },
 });

 runAppeal(cmd, Number(punishmentId));
};
