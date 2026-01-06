import type * as Discord from 'discord.js';
import log from './log.js';
import voiceHub from '../voiceStateCreates/voiceHub.js';
import voiceHubDel from '../voiceStateDeletes/voiceHub.js';

export default async (
 oldState: Discord.VoiceState,
 state: Discord.VoiceState,
 member?: Discord.GuildMember,
) => {
 log(oldState, state, member);
 voiceHub(state, member);

 if (oldState.channelId !== state.channelId) voiceHubDel(oldState);
};
