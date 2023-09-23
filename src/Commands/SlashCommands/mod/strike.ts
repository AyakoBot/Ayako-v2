import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const strike = await ch.DataBase.autopunish.findFirst({
  where: { guildid: cmd.guildId, active: true },
 });

 const language = await ch.getLanguage(cmd.guildId);

 if (!strike) {
  ch.errorCmd(cmd, language.slashCommands.moderation.strike.notEnabled, language);
  return;
 }

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);

 const modOptions: CT.ModOptions<'strikeAdd'> = {
  reason: reason ?? language.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
 };

 ch.mod(cmd, 'strikeAdd', modOptions);
};
