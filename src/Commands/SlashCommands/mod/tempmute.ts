import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const duration = cmd.options.getString('duration', false);
 const reason = cmd.options.getString('reason', false);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const timeout = duration ? cmd.client.util.getDuration(duration) : 60000;

 if (timeout > 2419200000) {
  cmd.client.util.errorCmd(cmd, language.mod.execution.tempMuteAdd.durationTooLong, language);
  return;
 }

 const modOptions: CT.ModOptions<CT.ModTypes.TempMuteAdd> = {
  reason: reason ?? language.t.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  duration: duration ? cmd.client.util.getDuration(duration) / 1000 : 60000,
  skipChecks: false,
 };

 cmd.client.util.mod(cmd, CT.ModTypes.TempMuteAdd, modOptions);
};
