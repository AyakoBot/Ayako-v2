import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.resetLevels;
 const role = cmd.options.getRole('role', true);

 await client.util.replyCmd(cmd, {
  content: lan.confirmRole(role, role.members.size),
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      emoji: client.util.emotes.tickWithBackground,
      style: Discord.ButtonStyle.Danger,
      custom_id: `reset-levels/confirm_role_${role.id}`,
      type: Discord.ComponentType.Button,
     },
     {
      emoji: client.util.emotes.crossWithBackground,
      style: Discord.ButtonStyle.Secondary,
      custom_id: 'reset-levels/reject',
      type: Discord.ComponentType.Button,
     },
    ],
   },
  ],
 });
};
