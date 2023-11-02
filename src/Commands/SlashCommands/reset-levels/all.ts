import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.resetLevels;
 const buttons = getButtons();
 const now = Date.now() + 30000;

 buttons.forEach((button) => {
  button.disabled = true;
 });

 await ch.replyCmd(cmd, {
  content: lan.areYouSure(ch.constants.standard.getTime(now)),
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
  emoji: ch.emotes.tickWithBackground,
  style: Discord.ButtonStyle.Danger,
  custom_id: 'reset-levels/confirm_all',
  type: Discord.ComponentType.Button,
 },
 {
  emoji: ch.emotes.crossWithBackground,
  style: Discord.ButtonStyle.Secondary,
  custom_id: 'reset-levels/reject_all',
  type: Discord.ComponentType.Button,
 },
];
