import { GuildMember, StageChannel, VoiceChannel } from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.vc,
 helpEmbed: {
  ...t.JSON.slashCommands.vc.helpEmbed,
  help: (cmdId: string) => t.stp(t.JSON.slashCommands.vc.helpEmbed.help, { cmdId }),
 },
 addedMember: (m: GuildMember, c: VoiceChannel | StageChannel, cmdId: string) =>
  t.stp(t.JSON.slashCommands.vc.addedMember, {
   member: t.languageFunction.getUser(m.user),
   channel: t.languageFunction.getChannel(c, t.channelTypes[c.type]),
   cmdId,
  }),
 removedMember: (m: GuildMember, c: VoiceChannel | StageChannel, cmdId: string) =>
  t.stp(t.JSON.slashCommands.vc.removedMember, {
   member: t.languageFunction.getUser(m.user),
   channel: t.languageFunction.getChannel(c, t.channelTypes[c.type]),
   cmdId,
  }),
 addedManager: (m: GuildMember, c: VoiceChannel | StageChannel, cmdId: string) =>
  t.stp(t.JSON.slashCommands.vc.addedManager, {
   member: t.languageFunction.getUser(m.user),
   channel: t.languageFunction.getChannel(c, t.channelTypes[c.type]),
   cmdId,
  }),
 removedManager: (m: GuildMember, c: VoiceChannel | StageChannel, cmdId: string) =>
  t.stp(t.JSON.slashCommands.vc.removedManager, {
   member: t.languageFunction.getUser(m.user),
   channel: t.languageFunction.getChannel(c, t.channelTypes[c.type]),
   cmdId,
  }),
 reason: (user: string) => t.stp(t.JSON.slashCommands.vc.reason, { user }),
 removedAll: (channel: VoiceChannel | StageChannel) =>
  t.stp(t.JSON.slashCommands.vc.removedAll, { channel }),
 removedAllManagers: (channel: VoiceChannel | StageChannel) =>
  t.stp(t.JSON.slashCommands.vc.removedAllManagers, { channel }),
 removedAllMembers: (channel: VoiceChannel | StageChannel) =>
  t.stp(t.JSON.slashCommands.vc.removedAllMembers, { channel }),
 created: (channel: VoiceChannel | StageChannel) =>
  t.stp(t.JSON.slashCommands.vc.created, { channel }),
});
