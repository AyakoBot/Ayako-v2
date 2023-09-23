import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const duration = cmd.options.getString('duration', true);
 const reason = cmd.options.getString('reason', false);

 const language = await ch.getLanguage(cmd.guildId);

 const modOptions: CT.ModOptions<'tempMuteAdd'> = {
  reason: reason ?? language.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  duration: ch.getDuration(duration),
 };

 ch.mod(cmd, 'tempMuteAdd', modOptions);
};
