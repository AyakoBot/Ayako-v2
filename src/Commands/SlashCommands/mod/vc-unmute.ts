import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const modOptions = {
  reason: reason ?? language.t.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  skipChecks: false,
 } satisfies CT.ModOptions<CT.ModTypes.VcMuteRemove>;

 cmd.client.util.mod(cmd, CT.ModTypes.VcMuteRemove, modOptions);
};
