import type * as Discord from 'discord.js';

export default async (state: Discord.VoiceState, member?: Discord.GuildMember) => {
 state.client.util.importCache.Events.BotEvents.voiceStateEvents.voiceStateDeletes.log.file.default(
  state,
  member,
 );
 state.client.util.importCache.Events.BotEvents.voiceStateEvents.voiceStateDeletes.voiceHub.file.default(
  state,
 );
};
