import * as Discord from 'discord.js';
import * as ch from '../../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) => {
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.create.start;

 let title = lan.createButtons.selectMenu[args[0] as keyof typeof lan.createButtons.selectMenu];
 if (!title) {
  title = lan.createButtons.fieldButtons[args[0] as keyof typeof lan.createButtons.fieldButtons];
 }

 cmd.showModal({
  title,
  customId: `embed-builder/editor_${args[0]}`,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Short,
      customId: 'input',
      label: lan.modals.timestamp.label,
      maxLength: 200,
      minLength: 0,
      placeholder: lan.modals.timestamp.placeholder,
      required: false,
      value: cmd.message.embeds[0].timestamp
       ? new Date(cmd.message.embeds[0].timestamp).toTimeString()
       : '',
     },
    ],
   },
  ],
 });
};
