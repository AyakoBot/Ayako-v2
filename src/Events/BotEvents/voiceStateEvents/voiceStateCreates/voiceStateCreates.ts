import type * as Discord from 'discord.js';
import log from './log.js';
import voiceHub from './voiceHub.js';

export default async (state: Discord.VoiceState, member?: Discord.GuildMember) => {
 log(state, member);
 voiceHub(state, member);
};
