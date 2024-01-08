import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);
 const duration = cmd.options.getString('duration', true);
 const deleteMessageDuration = cmd.options.getString('delete-message-duration', false);

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const modOptions: CT.ModOptions<CT.ModTypes.TempBanAdd> = {
  reason: reason ?? language.t.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  duration: cmd.client.util.getDuration(duration) / 1000,
  deleteMessageSeconds: deleteMessageDuration
   ? cmd.client.util.getDuration(deleteMessageDuration, 604800) / 1000
   : 604800,
  skipChecks: false,
 };

 cmd.client.util.mod(cmd, CT.ModTypes.TempBanAdd, modOptions);
};
