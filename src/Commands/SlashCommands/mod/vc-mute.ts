import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);
 const duration = cmd.options.getString('duration', false);

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const modOptions = {
  reason: reason ?? language.t.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  duration: duration ? cmd.client.util.getDuration(duration) / 1000 : undefined,
  skipChecks: false,
 };

 if (!duration) delete modOptions.duration;

 cmd.client.util.mod(
  cmd,
  duration ? CT.ModTypes.VcTempMuteAdd : CT.ModTypes.VcMuteAdd,
  modOptions as CT.ModOptions<
   typeof duration extends string ? CT.ModTypes.VcTempMuteAdd : CT.ModTypes.VcMuteAdd
  >,
 );
};
