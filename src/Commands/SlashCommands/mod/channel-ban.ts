import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import { AllNonThreadGuildChannelTypes } from '../../../Typings/Channel.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);
 const duration = cmd.options.getString('duration', false);
 const channel = cmd.options.getChannel('channel', true, AllNonThreadGuildChannelTypes);
 const deleteMessageDuration = cmd.options.getString('delete-message-duration', false);

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const modOptions = {
  reason: reason ?? language.t.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  channel,
  duration: duration ? cmd.client.util.getDuration(duration) : undefined,
  deleteMessageSeconds: deleteMessageDuration
   ? cmd.client.util.getDuration(deleteMessageDuration, 604800) / 1000
   : 604800,
  skipChecks: false,
 };

 if (!duration) delete modOptions.duration;

 cmd.client.util.mod(
  cmd,
  duration ? CT.ModTypes.TempChannelBanAdd : CT.ModTypes.ChannelBanAdd,
  modOptions as CT.ModOptions<
   typeof duration extends string ? CT.ModTypes.TempChannelBanAdd : CT.ModTypes.ChannelBanAdd
  >,
 );
};
