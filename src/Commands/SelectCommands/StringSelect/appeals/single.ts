import type { StringSelectMenuInteraction } from 'discord.js';
import { runAppeal } from '../../../SlashCommands/appeal.js';

export default async (cmd: StringSelectMenuInteraction, args: string[]) => {
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

 await cmd.client.util.DataBase.appealanswers.upsert({
  where: {
   punishmentid_questionid: { questionid: question.uniquetimestamp, punishmentid: punishmentId },
  },
  update: { singlechoice: cmd.values[0] },
  create: {
   questionid: question.uniquetimestamp,
   punishmentid: punishmentId,
   type: question.answertype,
   singlechoice: cmd.values[0],
  },
 });

 runAppeal(cmd, Number(punishmentId));
};
