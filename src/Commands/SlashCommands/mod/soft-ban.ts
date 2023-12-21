import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);
 const deleteMessageDuration = cmd.options.getString('delete-message-duration', false);

 const language = await ch.getLanguage(cmd.guildId);

 const modOptions: CT.ModOptions<CT.ModTypes.SoftBanAdd> = {
  reason: reason ?? language.t.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  deleteMessageSeconds: deleteMessageDuration
   ? ch.getDuration(deleteMessageDuration, 604800) / 1000
   : 604800,
  skipChecks: false,
 };

 ch.mod(cmd, CT.ModTypes.SoftBanAdd, modOptions);
};
