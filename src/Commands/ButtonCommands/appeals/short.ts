import {
 ComponentType,
 TextInputStyle,
 type ButtonInteraction,
 type TextInputComponentData,
} from 'discord.js';

export default async (
 cmd: ButtonInteraction,
 args: string[],
 type: 'text' | 'number' = 'text',
 size: 'short' | 'paragraph' = 'short',
) => {
 const language = await cmd.client.util.getLanguage(cmd.locale);
 const lan = language.slashCommands.appeal;

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

 cmd.showModal({
  title: lan.fillOut,
  customId: `appeal/${type}_${questionId}_${punishmentId}`,
  components: [
   {
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.TextInput,
      style: size === 'short' ? TextInputStyle.Short : TextInputStyle.Paragraph,
      customId: 'answer',
      required: question.required,
      placeholder: type === 'text' ? lan.text : lan.number,
      label: question.question?.slice(0, 45) || '-',
      value: (type === 'text' ? prevAnswer?.string : prevAnswer?.number?.toString()) || '',
     },
     ...((Number(question.question?.length) > 45
      ? [
         {
          type: ComponentType.TextInput,
          style: TextInputStyle.Paragraph,
          customId: 'instruction',
          label: language.t.Question,
          value: question.question,
         },
        ]
      : []) as TextInputComponentData[]),
    ],
   },
  ],
 });
};
