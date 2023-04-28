import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.edit;

 cmd.showModal({
  title: lan.title,
  customId: 'embed-builder/edit',
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Short,
      customId: 'message',
      placeholder: ch.constants.standard.msgurl('xxx', 'xxx', 'xxx'),
      label: lan.label,
     },
    ],
   },
  ],
 });
};
