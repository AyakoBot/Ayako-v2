import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (cmd.client.util.constants.debugGuilds.includes(cmd.guild?.id ?? '')) return
 const language = await cmd.client.util.getLanguage(cmd.guildId);
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
      placeholder: cmd.client.util.constants.standard.msgurl('xxx', 'xxx', 'xxx'),
      label: lan.label,
     },
    ],
   },
  ],
 });
};
