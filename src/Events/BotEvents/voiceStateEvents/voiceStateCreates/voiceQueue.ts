import type { GuildMember, VoiceState } from 'discord.js';

export default async (state: VoiceState, member?: GuildMember) => {
 if (!member) return;

 const queuedState = await member.client.util.DataBase.voiceStateUpdateQueue.findUnique({
  where: { userId_guildId: { guildId: member.guild.id, userId: member.id } },
 });
 if (!queuedState) return;

 const language = await member.client.util.getLanguage(member.guild.id);
 const lan = language.autotypes.voiceStateUpdateQueue;

 if (queuedState.deaf && !state.serverDeaf) deafen(member, lan);
 if (queuedState.mute && !state.serverMute) mute(member, lan);
 if (!queuedState.deaf && state.serverDeaf) undeafen(member, lan);
 if (!queuedState.mute && state.serverMute) unmute(member, lan);

 member.client.util.DataBase.voiceStateUpdateQueue
  .delete({ where: { userId_guildId: { guildId: member.guild.id, userId: member.id } } })
  .then();
};

const deafen = (member: GuildMember, reason: string) =>
 member.client.util.request.guilds.editMember(member, { deaf: true }, reason);

const mute = (member: GuildMember, reason: string) =>
 member.client.util.request.guilds.editMember(member, { mute: true }, reason);

const undeafen = (member: GuildMember, reason: string) =>
 member.client.util.request.guilds.editMember(member, { deaf: false }, reason);

const unmute = (member: GuildMember, reason: string) =>
 member.client.util.request.guilds.editMember(member, { mute: false }, reason);
