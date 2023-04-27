import * as Discord from 'discord.js';
import * as ch from '../../../../../BaseClient/ClientHelper.js';
import { getSelectedField } from '../../../../ModalCommands/embed-builder/create/editor.js';

export default async (
 cmd: Discord.StringSelectMenuInteraction | Discord.ButtonInteraction,
 args: string[],
) => {
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.create.start;
 const maxLength = getLength(args[0]);

 let title = lan.createButtons.selectMenu[args[0] as keyof typeof lan.createButtons.selectMenu];
 if (!title) {
  title = lan.createButtons.fieldButtons[args[0] as keyof typeof lan.createButtons.fieldButtons];
 }

 cmd.showModal({
  title,
  customId: `embed-builder/create/editor_${args[0]}`,
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
      value: getValue(args[0], cmd),
     },
    ],
   },
  ],
 });
};

const getLength = (arg: string) => {
 switch (arg) {
  case 'title':
  case 'author-name':
  case 'field-name':
   return 256;
  case 'footer-text':
  case 'description':
   return 2048;
  case 'field-value':
   return 1024;
  default:
   return 0;
 }
};

const getValue = (
 arg: string,
 cmd: Discord.StringSelectMenuInteraction | Discord.ButtonInteraction,
) => {
 const embed = cmd.message.embeds[0];
 if (!embed) return '';

 switch (arg) {
  case 'title':
   return embed.title ?? '';
  case 'author-name':
   return embed.author?.name ?? '';
  case 'field-name': {
   const fieldIndex = getSelectedField(cmd);
   if (!fieldIndex) return '';
   return embed.fields[Number(fieldIndex)]?.name ?? '';
  }
  case 'footer-text':
   return embed.footer?.text ?? '';
  case 'description':
   return embed.description ?? '';
  case 'field-value': {
   const fieldIndex = getSelectedField(cmd);
   if (!fieldIndex) return '';
   return embed.fields[Number(fieldIndex)]?.value ?? '';
  }
  default:
   return '';
 }
};
