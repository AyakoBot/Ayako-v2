import { AnswerType, type appeals, type punishments as Punishment } from '@prisma/client';
import {
 ButtonInteraction,
 ButtonStyle,
 ChatInputCommandInteraction,
 codeBlock,
 ComponentType,
 MessageFlags,
 SeparatorSpacingSize,
 type AnySelectMenuInteraction,
 type APIContainerComponent,
 type GuildBasedChannel,
 type ModalMessageModalSubmitInteraction,
} from 'discord.js';
import type { Language } from 'src/Typings/Typings';

export default async (cmd: ChatInputCommandInteraction) => {
 const punishmentId = parseInt(cmd.options.getString('punishment', true), 36);
 runAppeal(cmd, punishmentId);
};

export const runAppeal = async (
 cmd:
  | ChatInputCommandInteraction
  | ButtonInteraction
  | AnySelectMenuInteraction
  | ModalMessageModalSubmitInteraction,
 punishmentId: number,
) => {
 const punishment = await cmd.client.util.DataBase.punishments.findUnique({
  where: { uniquetimestamp: punishmentId, userid: cmd.user.id },
 });

 const language = await cmd.client.util.getLanguage(cmd.locale);
 const lan = language.slashCommands.appeal;

 if (!punishment) {
  cmd.client.util.errorCmd(cmd, lan.punNotFound, language);
  return;
 }

 const appeal = await cmd.client.util.DataBase.appeals.findFirst({
  where: { punishmentid: punishmentId, userid: cmd.user.id },
 });

 doAppeal(cmd, punishment, language, appeal);
};

const doAppeal = async (
 cmd:
  | ChatInputCommandInteraction
  | ButtonInteraction
  | AnySelectMenuInteraction
  | ModalMessageModalSubmitInteraction,
 punishment: Punishment,
 language: Language,
 appeal: appeals | null,
) => {
 const hasAppealed = !!appeal;
 const lan = language.slashCommands.appeal;

 const settings = await cmd.client.util.DataBase.appealsettings.findUnique({
  where: { guildid: punishment.guildid },
 });
 if (!settings?.active) {
  cmd.client.util.errorCmd(
   cmd,
   lan.appealsNotEnabled,
   await cmd.client.util.getLanguage(cmd.locale),
  );
  return;
 }

 const questions = await cmd.client.util.DataBase.appealquestions.findMany({
  where: { guildid: punishment.guildid, active: true },
  orderBy: { uniquetimestamp: 'asc' },
 });

 const container: APIContainerComponent = {
  type: ComponentType.Container,
  components: [
   {
    type: ComponentType.TextDisplay,
    content: lan.intro,
   },
   {
    type: ComponentType.TextDisplay,
    content: lan.punInfo(
     punishment.reason || language.t.noReasonProvided,
     punishment.type,
     Number(punishment.uniquetimestamp),
     (cmd.client.channels.cache.get(punishment.channelid) as GuildBasedChannel) || {
      id: punishment.channelid,
      name: punishment.channelname,
     },
     appeal?.status || null,
     appeal?.reason || null,
    ),
   },
   {
    type: ComponentType.Separator,
    divider: true,
    spacing: SeparatorSpacingSize.Large,
   },
  ],
 };

 const answers = await cmd.client.util.DataBase.appealanswers.findMany({
  where: {
   punishmentid: String(punishment.uniquetimestamp),
   questionid: { in: questions.map((q) => Number(q.uniquetimestamp)) },
  },
 });

 questions
  .filter((q): q is typeof q & { question: string } => !!q.question?.length)
  .filter((q) =>
   [AnswerType.single_choice, AnswerType.multiple_choice].includes(q.answertype)
    ? q.options.length
    : true,
  )
  .forEach((q) => {
   const answer = answers.find((a) => String(a.questionid) === String(q.uniquetimestamp));

   switch (q.answertype) {
    case AnswerType.text:
     container.components.push({ type: ComponentType.TextDisplay, content: `## ${q.question}` });
     break;

    case AnswerType.short:
    case AnswerType.paragraph:
    case AnswerType.number:
    case AnswerType.boolean: {
     const getType = () => {
      switch (q.answertype) {
       case AnswerType.number:
        return 'number';
       case AnswerType.boolean:
        return 'boolean';
       case AnswerType.short:
        return 'short';
       case AnswerType.paragraph:
        return 'paragraph';
       default:
        throw new Error('Unknown answer type', { cause: q.answertype });
      }
     };

     const getLabel = () => {
      switch (q.answertype) {
       case AnswerType.number:
        return language.t.Number;
       case AnswerType.boolean:
        return !answer || answer?.boolean === false ? language.t.No : language.t.Yes;
       case AnswerType.short:
       case AnswerType.paragraph:
        return language.t.Text;
       default:
        throw new Error('Unknown answer type', { cause: q.answertype });
      }
     };

     const getEmoji = () => {
      if (q.answertype !== AnswerType.boolean) return undefined;
      if (!answer || answer?.boolean === false) return cmd.client.util.emotes.disabled;
      return cmd.client.util.emotes.enabled;
     };

     container.components.push({
      type: ComponentType.Section,
      accessory: {
       type: ComponentType.Button,
       custom_id: `appeals/${getType()}_${q.uniquetimestamp}_${punishment.uniquetimestamp}`,
       label: getLabel(),
       style: ButtonStyle.Secondary,
       emoji: getEmoji(),
       disabled: hasAppealed,
      },
      components: [
       { type: ComponentType.TextDisplay, content: `### ${q.required ? '*' : ''}${q.question}` },
      ],
     });

     if (q.answertype === AnswerType.boolean) break;
     if (!answer) break;

     const getAnswer = () => {
      switch (q.answertype) {
       case AnswerType.short:
       case AnswerType.paragraph:
        return String(answer.string);
       case AnswerType.number:
        return String(answer.number);
       default:
        return undefined;
      }
     };

     const stringAnswer = getAnswer();
     if (!stringAnswer?.length) return;

     container.components.push({
      type: ComponentType.TextDisplay,
      content: codeBlock(stringAnswer),
     });

     break;
    }
    case AnswerType.multiple_choice:
    case AnswerType.single_choice: {
     container.components.push(
      { type: ComponentType.TextDisplay, content: `### ${q.required ? '*' : ''}${q.question}` },
      {
       type: ComponentType.ActionRow,
       components: [
        {
         type: ComponentType.StringSelect,
         custom_id: `appeals/${q.answertype === AnswerType.multiple_choice ? 'multi' : 'single'}_${q.uniquetimestamp}_${punishment.uniquetimestamp}`,
         options: [...new Set(q.options)]
          .map((o) => ({
           label: o,
           value: o,
           default:
            answer?.type === AnswerType.single_choice
             ? answer.singlechoice === o
             : answer?.multiplechoice.includes(o) || false,
          }))
          .splice(0, 25),
         max_values:
          q.answertype === AnswerType.multiple_choice
           ? Math.min(25, [...new Set(q.options)].length)
           : 1,
         min_values: q.required ? 1 : 0,
         placeholder:
          q.answertype === AnswerType.single_choice ? lan.selectOne : lan.selectMultiple,
         disabled: hasAppealed,
        },
       ],
      },
     );

     break;
    }

    default:
     throw new Error('Unknown answer type', { cause: q.answertype });
   }

   container.components.push({
    type: ComponentType.Separator,
    divider: true,
    spacing: SeparatorSpacingSize.Large,
   });
  });

 const cantSubmit =
  hasAppealed ||
  questions
   .filter((q) => q.required && q.answertype !== AnswerType.text)
   .some((q) => {
    const answer = answers.find((a) => String(a.questionid) === String(q.uniquetimestamp));
    if (!answer) return true;

    switch (q.answertype) {
     case AnswerType.boolean:
      return !answer.boolean;
     case AnswerType.single_choice:
      return !answer.singlechoice;
     case AnswerType.multiple_choice:
      return !answer.multiplechoice?.length;
     case AnswerType.short:
     case AnswerType.paragraph:
      return !answer.string?.length;
     case AnswerType.number:
      return answer.number === null || answer.number === undefined;
     default:
      return false;
    }
   }) ||
  false;

 container.components.push(
  { type: ComponentType.TextDisplay, content: lan.endInfo },
  {
   type: ComponentType.ActionRow,
   components: [
    {
     type: ComponentType.Button,
     custom_id: `appeals/submit_${punishment.uniquetimestamp}`,
     label: lan.submit,
     style: ButtonStyle.Success,
     disabled: cantSubmit,
    },
   ],
  },
 );

 if (cantSubmit || hasAppealed) {
  container.components.push({
   type: ComponentType.TextDisplay,
   content: hasAppealed ? lan.punAlreadyAppealed : lan.missingRequired,
  });
 }

 if (cmd instanceof ChatInputCommandInteraction) {
  cmd.reply({
   components: [container],
   flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
  });

  return;
 }

 cmd.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
};
