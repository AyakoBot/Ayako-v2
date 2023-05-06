import type * as Discord from 'discord.js';
import log from './log.js';

export default async (
 oldState: Discord.VoiceState,
 state: Discord.VoiceState,
 member: Discord.GuildMember,
) => {
 log(oldState, state, member);
};
