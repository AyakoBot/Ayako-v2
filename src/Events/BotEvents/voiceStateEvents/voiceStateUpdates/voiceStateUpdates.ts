import type * as Discord from 'discord.js';

export default async (
 oldState: Discord.VoiceState,
 state: Discord.VoiceState,
 member?: Discord.GuildMember,
) => {
 state.client.util.importCache.Events.BotEvents.voiceStateEvents.voiceStateUpdates.log.file.default(
  oldState,
  state,
  member,
 );
};
