import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { AllNonThreadGuildChannelTypes } from '../../../BaseClient/Other/constants.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);
 const channel = cmd.options.getChannel('channel', true, AllNonThreadGuildChannelTypes);

 const language = await ch.getLanguage(cmd.guildId);

 const modOptions: CT.ModOptions<'channelBanRemove'> = {
  reason: reason ?? language.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  channel,
  skipChecks: false,
 };

 ch.mod(cmd, 'channelBanRemove', modOptions);
};
