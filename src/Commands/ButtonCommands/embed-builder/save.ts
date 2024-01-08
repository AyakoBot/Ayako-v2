import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.save;

 cmd.showModal({
  title: lan.title,
  customId: 'embed-builder/save',
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Short,
      customId: 'name',
      label: lan.label,
     },
    ],
   },
  ],
 });
};
