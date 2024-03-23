import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import { AllNonThreadGuildChannelTypes } from '../../../Typings/Channel.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = cmd.options.getUser('user', true);
 const reason = cmd.options.getString('reason', false);
 const duration = cmd.options.getString('duration', true);
 const channel = cmd.options.getChannel('channel', true, AllNonThreadGuildChannelTypes);

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const modOptions: CT.ModOptions<CT.ModTypes.TempChannelBanAdd> = {
  reason: reason ?? language.t.noReasonProvided,
  guild: cmd.guild,
  target: user,
  executor: cmd.user,
  dbOnly: false,
  duration: cmd.client.util.getDuration(duration) / 1000,
  channel,
  skipChecks: false,
 };

 cmd.client.util.mod(cmd, CT.ModTypes.TempChannelBanAdd, modOptions);
};
