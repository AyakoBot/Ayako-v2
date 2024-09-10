import * as Discord from 'discord.js';

export default async (
 cmd: Discord.ButtonInteraction,
 _args: string[],
 isEnableAction: boolean = false,
) => {
 cmd.client.util.DataBase.users
  .upsert({
   where: { userid: cmd.user.id },
   update: { votereminders: isEnableAction },
   create: {
    userid: cmd.user.id,
    username: cmd.user.username,
    avatar: cmd.user.displayAvatarURL(),
    lastfetch: Date.now(),
    votereminders: isEnableAction,
   },
  })
  .then();

 const language = await cmd.client.util.getLanguage(cmd.locale);

 cmd.update({
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: cmd.message.components[0].components
     .map((c) => c.toJSON())
     .filter((c) => ('custom_id' in c ? !c.custom_id.includes('voteReminder') : true)),
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: language.events.vote.reminder.reminders,
      emoji: isEnableAction ? cmd.client.util.emotes.enabled : cmd.client.util.emotes.disabled,
      custom_id: isEnableAction ? 'voteReminder/disable' : 'voteReminder/enable',
      style: Discord.ButtonStyle.Secondary,
     },
    ],
   },
  ],
 });
};
