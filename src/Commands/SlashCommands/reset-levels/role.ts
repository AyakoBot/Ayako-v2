import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.resetLevels;
 const role = cmd.options.getRole('role', true);

 await ch.replyCmd(cmd, {
  content: lan.confirmRole(role, role.members.size),
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      emoji: ch.emotes.tickWithBackground,
      style: Discord.ButtonStyle.Danger,
      custom_id: `reset-levels/confirm_role_${role.id}`,
      type: Discord.ComponentType.Button,
     },
     {
      emoji: ch.emotes.crossWithBackground,
      style: Discord.ButtonStyle.Secondary,
      custom_id: 'reset-levels/reject',
      type: Discord.ComponentType.Button,
     },
    ],
   },
  ],
 });
};
