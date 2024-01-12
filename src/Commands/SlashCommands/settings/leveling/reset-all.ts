import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import client from '../../../../BaseClient/Bot/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.resetLevels;
 const buttons = getButtons();
 const now = Date.now() + 30000;

 buttons.forEach((button) => {
  button.disabled = true;
 });

 await client.util.replyCmd(cmd, {
  content: lan.areYouSure(client.util.constants.standard.getTime(now)),
  components: [{ type: Discord.ComponentType.ActionRow, components: buttons }],
 });

 Jobs.scheduleJob(new Date(now), () => {
  cmd.editReply({
   content: lan.areYouSure2,
   components: [{ type: Discord.ComponentType.ActionRow, components: getButtons() }],
  });
 });
};

const getButtons = (): Discord.APIButtonComponent[] => [
 {
  emoji: client.util.emotes.tickWithBackground,
  style: Discord.ButtonStyle.Danger,
  custom_id: 'reset-levels/confirm_all',
  type: Discord.ComponentType.Button,
 },
 {
  emoji: client.util.emotes.crossWithBackground,
  style: Discord.ButtonStyle.Secondary,
  custom_id: 'reset-levels/reject_all',
  type: Discord.ComponentType.Button,
 },
];
