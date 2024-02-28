import * as Discord from 'discord.js';

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
 Discord.ChannelType.GuildMedia,
] as const;

export const ChannelBanBits = [
 Discord.PermissionsBitField.Flags.SendMessages,
 Discord.PermissionsBitField.Flags.SendMessagesInThreads,
 Discord.PermissionsBitField.Flags.ViewChannel,
 Discord.PermissionsBitField.Flags.AddReactions,
 Discord.PermissionsBitField.Flags.Connect,
] as const;
