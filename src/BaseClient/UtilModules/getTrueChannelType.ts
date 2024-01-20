import * as Discord from 'discord.js';

/**
 * Returns the true type of a Discord channel.
 * @param channel - The Discord channel to get the type of.
 * @param guild - The guild the channel belongs to.
 * @returns The true type of the channel.
 * @throws An error if the channel type is unknown.
 */
export default (channel: Discord.Channel | Discord.GuildChannel, guild: Discord.Guild) => {
 switch (channel?.type) {
  case Discord.ChannelType.GuildText: {
   switch (true) {
    case guild.rulesChannelId === channel.id:
     return 'Rules';
    case 'nsfw' in channel && channel.nsfw:
     return 'NSFWChannel';
    case !!channel.permissionOverwrites:
     return 'LockedChannel';
    default:
     return 'TextChannel';
   }
  }
  case Discord.ChannelType.DM: {
   return 'DM';
  }
  case Discord.ChannelType.GuildVoice: {
   switch (true) {
    case !!channel.permissionOverwrites:
     return 'LockedVoice';
    default:
     return 'Voice';
   }
  }
  case Discord.ChannelType.GroupDM:
   return 'GroupDm';
  case Discord.ChannelType.GuildCategory:
   return 'Category';
  case Discord.ChannelType.GuildAnnouncement:
   return 'NewsChannel';
  case Discord.ChannelType.AnnouncementThread:
  case Discord.ChannelType.PublicThread:
  case Discord.ChannelType.PrivateThread:
   return 'Thread';
  case Discord.ChannelType.GuildStageVoice:
   return 'Stage';
  case Discord.ChannelType.GuildDirectory:
   return 'Directory';
  case Discord.ChannelType.GuildForum: {
   switch (true) {
    case 'nsfw' in channel && channel.nsfw:
     return 'NSFWForum';
    default:
     return 'Forum';
   }
  }
  case Discord.ChannelType.GuildMedia:
   return 'MediaChannel';
  default:
   // @ts-ignore
   throw new Error(`Unknown Channel Type: ${channel.type} / ${Discord.ChannelType[channel.type]}`);
 }
};
