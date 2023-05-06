import * as Discord from 'discord.js';

export default (channel: Discord.Channel | Discord.GuildChannel, guild: Discord.Guild) => {
 switch (channel.type) {
  case Discord.ChannelType.GuildText: {
   switch (true) {
    case guild.rulesChannelId === channel.id: {
     return 'Rules';
    }
    case 'nsfw' in channel && channel.nsfw: {
     return 'NSFWChannel';
    }
    case !!channel.permissionOverwrites: {
     return 'LockedChannel';
    }
    default: {
     return 'TextChannel';
    }
   }
  }
  case Discord.ChannelType.DM: {
   return 'DM';
  }
  case Discord.ChannelType.GuildVoice: {
   switch (true) {
    case !!channel.permissionOverwrites: {
     return 'LockedVoice';
    }
    default: {
     return 'Voice';
    }
   }
  }
  case Discord.ChannelType.GroupDM: {
   return 'GroupDm';
  }
  case Discord.ChannelType.GuildCategory: {
   return 'Category';
  }
  case Discord.ChannelType.GuildAnnouncement: {
   return 'NewsChannel';
  }
  case Discord.ChannelType.AnnouncementThread:
  case Discord.ChannelType.PublicThread:
  case Discord.ChannelType.PrivateThread: {
   return 'Thread';
  }
  case Discord.ChannelType.GuildStageVoice: {
   return 'Stage';
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  case Discord.ChannelType.GuildDirectory: {
   return 'Directory';
  }
  case Discord.ChannelType.GuildForum: {
   switch (true) {
    case 'nsfw' in channel && channel.nsfw: {
     return 'NSFWForum';
    }
    default: {
     return 'Forum';
    }
   }
  }
  default: {
   throw new Error('Unknown Channel Type');
  }
 }
};
