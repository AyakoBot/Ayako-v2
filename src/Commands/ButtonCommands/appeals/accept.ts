import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[], accept: boolean = true) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.events.appeal;

 cmd.showModal({
  title: accept ? lan.accept : lan.reject,
  customId: `appeals_${args[0]}_${accept ? 'accept' : 'reject'}`,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Paragraph,
      customId: `reason`,
      label: language.t.Reason,
      required: true,
      placeholder: lan.willBeShared,
     },
    ],
   },
  ],
 });
};
