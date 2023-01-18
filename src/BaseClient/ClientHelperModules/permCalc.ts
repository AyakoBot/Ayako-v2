import Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';

export default (bits: number, lan: CT.Language, isntRole: false) => {
  const bitField = new Discord.PermissionsBitField(BigInt(bits));
  const perms = [];

  switch (true) {
    case bitField.has(1n): {
      perms.push(lan.permissions.perms.CreateInstantInvite);
      break;
    }
    case bitField.has(2n): {
      perms.push(lan.permissions.perms.KickMembers);
      break;
    }
    case bitField.has(4n): {
      perms.push(lan.permissions.perms.BanMembers);
      break;
    }
    case bitField.has(8n): {
      perms.push(lan.permissions.perms.Administrator);
      break;
    }
    case bitField.has(16n): {
      if (isntRole) {
        perms.push(lan.permissions.perms.ManageChannel);
      } else {
        perms.push(lan.permissions.perms.ManageChannels);
      }
      break;
    }
    case bitField.has(32n): {
      perms.push(lan.permissions.perms.ManageGuild);
      break;
    }
    case bitField.has(64n): {
      perms.push(lan.permissions.perms.AddReactions);
      break;
    }
    case bitField.has(128n): {
      perms.push(lan.permissions.perms.ViewAuditLog);
      break;
    }
    case bitField.has(256n): {
      perms.push(lan.permissions.perms.PrioritySpeaker);
      break;
    }
    case bitField.has(512n): {
      perms.push(lan.permissions.perms.Stream);
      break;
    }
    case bitField.has(1024n): {
      if (isntRole) {
        perms.push(lan.permissions.perms.ViewChannel);
      } else {
        perms.push(lan.permissions.perms.ViewChannels);
      }
      break;
    }
    case bitField.has(2048n): {
      perms.push(lan.permissions.perms.SendMessages);
      break;
    }
    case bitField.has(4096n): {
      perms.push(lan.permissions.perms.SendTTSMessages);
      break;
    }
    case bitField.has(8192n): {
      perms.push(lan.permissions.perms.ManageMessages);
      break;
    }
    case bitField.has(16384n): {
      perms.push(lan.permissions.perms.EmbedLinks);
      break;
    }
    case bitField.has(32768n): {
      perms.push(lan.permissions.perms.AttachFiles);
      break;
    }
    case bitField.has(65536n): {
      perms.push(lan.permissions.perms.ReadMessageHistory);
      break;
    }
    case bitField.has(131072n): {
      perms.push(lan.permissions.perms.MentionEveryone);
      break;
    }
    case bitField.has(262144n): {
      perms.push(lan.permissions.perms.UseExternalEmojis);
      break;
    }
    case bitField.has(524288n): {
      perms.push(lan.permissions.perms.ViewGuildInsights);
      break;
    }
    case bitField.has(1048576n): {
      perms.push(lan.permissions.perms.Connect);
      break;
    }
    case bitField.has(2097152n): {
      perms.push(lan.permissions.perms.Speak);
      break;
    }
    case bitField.has(4194304n): {
      perms.push(lan.permissions.perms.MuteMembers);
      break;
    }
    case bitField.has(8388608n): {
      perms.push(lan.permissions.perms.DeafenMembers);
      break;
    }
    case bitField.has(16777216n): {
      perms.push(lan.permissions.perms.MoveMembers);
      break;
    }
    case bitField.has(33554432n): {
      perms.push(lan.permissions.perms.UseVAD);
      break;
    }
    case bitField.has(67108864n): {
      perms.push(lan.permissions.perms.ChangeNickname);
      break;
    }
    case bitField.has(134217728n): {
      perms.push(lan.permissions.perms.ManageNicknames);
      break;
    }
    case bitField.has(268435456n): {
      if (isntRole) {
        perms.push(lan.permissions.perms.ManagePermissions);
      } else {
        perms.push(lan.permissions.perms.ManageRoles);
      }
      break;
    }
    case bitField.has(536870912n): {
      perms.push(lan.permissions.perms.ManageWebhooks);
      break;
    }
    case bitField.has(1073741824n): {
      perms.push(lan.permissions.perms.ManageEmojisAndStickers);
      break;
    }
    case bitField.has(2147483648n): {
      perms.push(lan.permissions.perms.UseApplicationCommands);
      break;
    }
    case bitField.has(4294967296n): {
      perms.push(lan.permissions.perms.RequestToSpeak);
      break;
    }
    case bitField.has(8589934592n): {
      perms.push(lan.permissions.perms.ManageEvents);
      break;
    }
    case bitField.has(17179869184n): {
      perms.push(lan.permissions.perms.ManageThreads);
      break;
    }
    case bitField.has(34359738368n): {
      perms.push(lan.permissions.perms.CreatePublicThreads);
      break;
    }
    case bitField.has(68719476736n): {
      perms.push(lan.permissions.perms.CreatePrivateThreads);
      break;
    }
    case bitField.has(137438953472n): {
      perms.push(lan.permissions.perms.UseExternalStickers);
      break;
    }
    case bitField.has(274877906944n): {
      perms.push(lan.permissions.perms.SendMessagesInThreads);
      break;
    }
    case bitField.has(549755813888n): {
      perms.push(lan.permissions.perms.UseEmbeddedActivities);
      break;
    }
    case bitField.has(1099511627776n): {
      perms.push(lan.permissions.perms.ModerateMembers);
      break;
    }
    default: {
      break;
    }
  }

  return perms;
};
