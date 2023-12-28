import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import verify from './verification/verify.js';
import { getPayload } from '../SlashCommands/settings/automation/verification.js';

export default async (cmd: Discord.ButtonInteraction<'cached'>) => {
 verify(cmd);

 const language = await ch.getLanguage(cmd.guildId);
 const payload = await getPayload(language, cmd.guild);

 ch.request.channels.editMsg(cmd.message, {
  embeds: payload.embeds,
  content: payload.content,
  components: payload.components,
 });
};
