import type * as DDeno from 'discordeno';

export default (channel: DDeno.Channel, guild: DDeno.Guild) => {
  switch (channel.type) {
    case 0: {
      switch (true) {
        case guild.rulesChannelId === channel.id: {
          return 'Rules';
        }
        case channel.nsfw: {
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
    case 1: {
      return 'DM';
    }
    case 2: {
      switch (true) {
        case !!channel.permissionOverwrites: {
          return 'LockedVoice';
        }
        default: {
          return 'Voice';
        }
      }
    }
    case 3: {
      return 'GroupDm';
    }
    case 4: {
      return 'Category';
    }
    case 5: {
      return 'NewsChannel';
    }
    case 10:
    case 11:
    case 12: {
      return 'Thread';
    }
    case 13: {
      return 'Stage';
    }
    case 14: {
      return 'Directory';
    }
    case 15: {
      switch (true) {
        case channel.nsfw: {
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
