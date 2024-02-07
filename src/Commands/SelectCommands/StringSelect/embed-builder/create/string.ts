import * as Discord from 'discord.js';
import { EmbedFields } from '../../../../../BaseClient/Other/constants/customEmbeds.js';
import startOver from '../../../../ButtonCommands/embed-builder/startOver.js';
import { getSelectedField } from '../../../../ButtonCommands/embed-builder/deleteCustom.js';

export default async (
 cmd: Discord.StringSelectMenuInteraction | Discord.ButtonInteraction,
 args: string[],
) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.create.start;
 const arg = args[0] as EmbedFields;
 const maxLength = getLength(arg);

 let title = lan.createButtons.selectMenu[arg as keyof typeof lan.createButtons.selectMenu];
 if (!title) {
  title = lan.createButtons.fieldButtons[arg as keyof typeof lan.createButtons.fieldButtons];
 }

 if (!usesMsg(arg)) {
  cmd.showModal({
   title,
   customId: `embed-builder/editor_${arg}`,
   components: [
    {
     type: Discord.ComponentType.ActionRow,
     components: [
      {
       type: Discord.ComponentType.TextInput,
       style: maxLength > 1000 ? Discord.TextInputStyle.Paragraph : Discord.TextInputStyle.Short,
       customId: 'input',
       label: lan.modals.string.label,
       maxLength,
       minLength: 0,
       placeholder: lan.modals.string.placeholder,
       required: false,
       value: getValue(arg, cmd),
      },
     ],
    },
   ],
  });

  return;
 }

 const selectedField = getSelectedField(cmd.message);

 await startOver(
  cmd,
  [],
  cmd.message.embeds[1].data,
  typeof selectedField === 'number' ? Number(selectedField) : null,
  arg,
 );
};

export const getLength = (arg: EmbedFields) => {
 switch (arg) {
  case EmbedFields.Title:
  case EmbedFields.AuthorName:
  case EmbedFields.FieldName:
   return 256;
  case EmbedFields.FooterText:
  case EmbedFields.Description:
   return 2048;
  case EmbedFields.FieldValue:
   return 1024;
  default:
   throw new Error(`Invalid argument ${arg}`);
 }
};

const usesMsg = (arg: EmbedFields) => {
 switch (arg) {
  case EmbedFields.AuthorName:
  case EmbedFields.FooterText:
   return false;
  case EmbedFields.Title:
  case EmbedFields.FieldName:
  case EmbedFields.FieldValue:
  case EmbedFields.Description:
   return true;
  default:
   throw new Error(`Invalid argument ${arg}`);
 }
};

const getValue = (
 arg: EmbedFields,
 cmd: Discord.StringSelectMenuInteraction | Discord.ButtonInteraction,
) => {
 const embed = cmd.message.embeds[1];
 if (!embed) return '';

 switch (arg) {
  case EmbedFields.Title:
   return embed.title ?? '';
  case EmbedFields.AuthorName:
   return embed.author?.name ?? '';
  case EmbedFields.FieldName: {
   const fieldIndex = getSelectedField(cmd.message);
   if (!fieldIndex) return '';
   return embed.fields[Number(fieldIndex)]?.name ?? '';
  }
  case EmbedFields.FooterText:
   return embed.footer?.text ?? '';
  case EmbedFields.Description:
   return embed.description ?? '';
  case EmbedFields.FieldValue: {
   const fieldIndex = getSelectedField(cmd.message);
   if (!fieldIndex) return '';
   return embed.fields[Number(fieldIndex)]?.value ?? '';
  }
  default:
   return '';
 }
};
