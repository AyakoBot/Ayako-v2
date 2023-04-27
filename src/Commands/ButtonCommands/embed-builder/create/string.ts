import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.create.start;
 const maxLength = getLength(args[0]);

 cmd.showModal({
  title: lan.createButtons[args[0] as keyof typeof lan.createButtons],
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

const getValue = (arg: string, cmd: Discord.ButtonInteraction) => {
 const embed = cmd.message.embeds[0];
 if (!embed) return '';

 switch (arg) {
  case 'title':
   return embed.title ?? '';
  case 'author-name':
   return embed.author?.name ?? '';
  case 'field-name': {
   const fieldIndex = cmd.message.components[4].components[0].customId;
   if (!fieldIndex) return '';
   return embed.fields[Number(fieldIndex)]?.name ?? '';
  }
  case 'footer-text':
   return embed.footer?.text ?? '';
  case 'description':
   return embed.description ?? '';
  case 'field-value': {
   const fieldIndex = cmd.message.components[4].components[0].customId;
   if (!fieldIndex) return '';
   return embed.fields[Number(fieldIndex)]?.value ?? '';
  }
  default:
   return '';
 }
};
