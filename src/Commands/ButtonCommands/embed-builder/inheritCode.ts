import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.inherit;

 cmd.showModal({
  title: lan.title,
  customId: 'embed-builder/inheritCode',
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Paragraph,
      customId: '0',
      label: lan.label,
      placeholder: lan.placeholder0,
      required: true,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Paragraph,
      customId: '1',
      label: lan.label,
      placeholder: lan.placeholder1,
      required: false,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Paragraph,
      customId: '2',
      label: lan.label,
      placeholder: lan.placeholder2,
      required: false,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Paragraph,
      customId: '3',
      label: lan.label,
      placeholder: lan.placeholder3,
      required: false,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Paragraph,
      customId: '4',
      placeholder: lan.placeholder4,
      label: lan.label,
      required: false,
     },
    ],
   },
  ],
 });
};
