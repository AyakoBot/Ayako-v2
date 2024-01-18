import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, _args: string[], enable: boolean = false) => {
 cmd.client.util.DataBase.users
  .upsert({
   where: { userid: cmd.user.id },
   update: { votereminders: enable },
   create: {
    userid: cmd.user.id,
    username: cmd.user.username,
    avatar: cmd.user.displayAvatarURL(),
    lastfetch: Date.now(),
    votereminders: enable,
   },
  })
  .then();

 const language = await cmd.client.util.getLanguage(cmd.locale);

 cmd.update({
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: cmd.message.components[0].components.map((c) => c.toJSON()),
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: language.events.vote.reminder.reminders,
      emoji: enable ? cmd.client.util.emotes.disabled : cmd.client.util.emotes.enabled,
      custom_id: enable ? 'voteReminder/disable' : 'voteReminder/enable',
      style: Discord.ButtonStyle.Secondary,
     },
    ],
   },
  ],
 });
};
