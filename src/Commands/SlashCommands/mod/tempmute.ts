import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const duration = cmd.options.getString('duration', true);
 const reason = cmd.options.getString('reason', false);

 const language = await ch.getLanguage(cmd.guildId);
 const timeout = ch.getDuration(duration);

 if (timeout > 2419200000) {
  ch.errorCmd(cmd, language.mod.execution.tempMuteAdd.durationTooLong, language);
  return;
 }

 const modOptions: CT.ModOptions<CT.ModTypes.TempMuteAdd> = {
  reason: reason ?? language.t.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  duration: ch.getDuration(duration) / 1000,
  skipChecks: false,
 };

 ch.mod(cmd, CT.ModTypes.TempMuteAdd, modOptions);
};
