import * as Discord from 'discord.js';

import settingsEditorTypes from './constants/settingsEditorTypes.js';
import events from './constants/events.js';
import standard from './constants/standard.js';
import interactions from './constants/interactions.js';
import customembeds from './constants/customEmbeds.js';
import tutorials from './constants/tutorials.js';

export const GuildTextChannelTypes = [
 Discord.ChannelType.AnnouncementThread,
 Discord.ChannelType.GuildAnnouncement,
 Discord.ChannelType.GuildStageVoice,
 Discord.ChannelType.GuildText,
 Discord.ChannelType.GuildVoice,
 Discord.ChannelType.PrivateThread,
 Discord.ChannelType.PublicThread,
] as const;

export const AllNonThreadGuildChannelTypes = [
 Discord.ChannelType.GuildAnnouncement,
 Discord.ChannelType.GuildStageVoice,
 Discord.ChannelType.GuildText,
 Discord.ChannelType.GuildVoice,
 Discord.ChannelType.GuildForum,
] as const;

export const ChannelBanBits = [
 Discord.PermissionsBitField.Flags.SendMessages,
 Discord.PermissionsBitField.Flags.SendMessagesInThreads,
 Discord.PermissionsBitField.Flags.ViewChannel,
 Discord.PermissionsBitField.Flags.AddReactions,
 Discord.PermissionsBitField.Flags.Connect,
] as const;

export default {
 path: {
  allowlist: '/root/Bots/Ayako-VueJS/Website-CDN/antivirus/allowlisted.txt',
  badLinks: '/root/Bots/Ayako-VueJS/Website-CDN/antivirus/badLinks.txt',
 },
 events,
 discordMsgUrls: [
  'https://discord.com/channels/[Guild ID]/[Channel ID]/[Message ID]',
  'https://ptb.discord.com/channels/[Guild ID]/[Channel ID]/[Message ID]',
  'https://canary.discord.com/channels/[Guild ID]/[Channel ID]/[Message ID]',
 ],
 standard,
 customembeds,
 commands: {
  help: {
   'Stick Message':
    'Stick a Message to a Channel. The sticked Message will be re-posted with a Delay of 1 Minute after another Message is sent\nUn-Stick the Message by deleting it.',
  },
  interactions,
  settings: {
   basicSettings: ['vote', 'leveling', 'nitro', 'appeals'],
   types: settingsEditorTypes,
  },
 },
 tutorials,
};
