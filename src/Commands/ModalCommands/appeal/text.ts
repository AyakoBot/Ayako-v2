import type { ModalSubmitInteraction } from 'discord.js';
import { runAppeal } from '../../../Commands/SlashCommands/appeal.js';

export default async (
 cmd: ModalSubmitInteraction,
 args: string[],
 type: 'string' | 'number' = 'string',
) => {
 if (!cmd.isFromMessage()) return;

 const language = await cmd.client.util.getLanguage(cmd.locale);

 if (type === 'number' && Number.isNaN(+cmd.fields.getTextInputValue('answer'))) {
  cmd.client.util.errorCmd(cmd, language.errors.numNaN, language);
  return;
 }

 const questionId = args.shift()!;
 const punishmentId = args.shift()!;

 const question = await cmd.client.util.DataBase.appealquestions.findUnique({
  where: { uniquetimestamp: Number(questionId) },
 });
 if (!question) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.appeal.questionNotFound, language);
  return;
 }

 const value =
  type === 'number'
   ? Number(cmd.fields.getTextInputValue('answer'))
   : cmd.fields.getTextInputValue('answer');

 await cmd.client.util.DataBase.appealanswers.upsert({
  where: {
   punishmentid_questionid: { questionid: question.uniquetimestamp, punishmentid: punishmentId },
  },
  update: {
   [type]: value,
   type: question.answertype,
  },
  create: {
   questionid: question.uniquetimestamp,
   punishmentid: punishmentId,
   type: question.answertype,
   [type]: value,
  },
 });

 runAppeal(cmd, Number(punishmentId));
};
