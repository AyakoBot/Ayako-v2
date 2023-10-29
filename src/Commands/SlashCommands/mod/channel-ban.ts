import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { AllNonThreadGuildChannelTypes } from '../../../BaseClient/Other/constants.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);
 const duration = cmd.options.getString('duration', false);
 const channel = cmd.options.getChannel('channel', true, AllNonThreadGuildChannelTypes);
 const deleteMessageDuration = cmd.options.getString('delete-message-duration', false);

 const language = await ch.getLanguage(cmd.guildId);

 const modOptions = {
  reason: reason ?? language.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  channel,
  duration: duration ? ch.getDuration(duration) : undefined,
  deleteMessageSeconds: deleteMessageDuration
   ? ch.getDuration(deleteMessageDuration, 604800) / 1000
   : 604800,
  skipChecks: false,
 };

 if (!duration) delete modOptions.duration;

 ch.mod(
  cmd,
  duration ? 'tempChannelBanAdd' : 'channelBanAdd',
  modOptions as CT.ModOptions<
   typeof duration extends string ? 'tempChannelBanAdd' : 'channelBanAdd'
  >,
 );
};
