import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import { isBlocked } from './ban.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 if (await isBlocked(cmd, user, cmd.options.getMember('user'), CT.ModTypes.KickAdd, language)) {
  return;
 }

 const modOptions: CT.ModOptions<CT.ModTypes.KickAdd> = {
  reason: reason ?? language.t.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  skipChecks: false,
 };

 cmd.client.util.mod(cmd, CT.ModTypes.KickAdd, modOptions);
};
