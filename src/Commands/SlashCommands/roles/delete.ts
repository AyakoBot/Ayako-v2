import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const role = cmd.options.getRole('role', true);

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.delete;

 ch.replyCmd(cmd, {
  content: lan.areYouSure(role as Discord.Role),
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: language.t.Yes,
      style: Discord.ButtonStyle.Danger,
      custom_id: `roles/delete_${role.id}`,
      emoji: ch.emotes.warning,
     },
    ],
   },
  ],
 });
};
