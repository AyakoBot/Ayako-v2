import Discord from 'discord.js';

export default (bits: number, lan: typeof import('../../Languages/en.json'), isntRole: false) => {
  const bitField = new Discord.PermissionsBitField(BigInt(bits));
  const perms = [];

  switch (true) {
    case bitField.has(1n): {
      perms.push(lan.permissions.perms.createInstantInvite);
      break;
    }
    case bitField.has(2n): {
      perms.push(lan.permissions.perms.kickMembers);
      break;
    }
    case bitField.has(4n): {
      perms.push(lan.permissions.perms.banMembers);
      break;
    }
    case bitField.has(8n): {
      perms.push(lan.permissions.perms.administrator);
      break;
    }
    case bitField.has(16n): {
      if (isntRole) {
        perms.push(lan.permissions.perms.manageChannel);
      } else {
        perms.push(lan.permissions.perms.manageChannels);
      }
      break;
    }
    case bitField.has(32n): {
      perms.push(lan.permissions.perms.manageGuild);
      break;
    }
    case bitField.has(64n): {
      perms.push(lan.permissions.perms.addReactions);
      break;
    }
    case bitField.has(128n): {
      perms.push(lan.permissions.perms.viewAuditLog);
      break;
    }
    case bitField.has(256n): {
      perms.push(lan.permissions.perms.voicePrioritySpeaker);
      break;
    }
    case bitField.has(512n): {
      perms.push(lan.permissions.perms.voiceStream);
      break;
    }
    case bitField.has(1024n): {
      if (isntRole) {
        perms.push(lan.permissions.perms.viewChannel);
      } else {
        perms.push(lan.permissions.perms.viewChannels);
      }
      break;
    }
    case bitField.has(2048n): {
      perms.push(lan.permissions.perms.sendMessages);
      break;
    }
    case bitField.has(4096n): {
      perms.push(lan.permissions.perms.sendTTSMessages);
      break;
    }
    case bitField.has(8192n): {
      perms.push(lan.permissions.perms.manageMessages);
      break;
    }
    case bitField.has(16384n): {
      perms.push(lan.permissions.perms.embedLinks);
      break;
    }
    case bitField.has(32768n): {
      perms.push(lan.permissions.perms.attachFiles);
      break;
    }
    case bitField.has(65536n): {
      perms.push(lan.permissions.perms.readMessageHistory);
      break;
    }
    case bitField.has(131072n): {
      perms.push(lan.permissions.perms.mentionEveryone);
      break;
    }
    case bitField.has(262144n): {
      perms.push(lan.permissions.perms.useExternalEmojis);
      break;
    }
    case bitField.has(524288n): {
      perms.push(lan.permissions.perms.viewGuildInsights);
      break;
    }
    case bitField.has(1048576n): {
      perms.push(lan.permissions.perms.voiceConnect);
      break;
    }
    case bitField.has(2097152n): {
      perms.push(lan.permissions.perms.voiceSpeak);
      break;
    }
    case bitField.has(4194304n): {
      perms.push(lan.permissions.perms.voiceMuteMembers);
      break;
    }
    case bitField.has(8388608n): {
      perms.push(lan.permissions.perms.voiceDeafenMembers);
      break;
    }
    case bitField.has(16777216n): {
      perms.push(lan.permissions.perms.voiceMoveMembers);
      break;
    }
    case bitField.has(33554432n): {
      perms.push(lan.permissions.perms.voiceUseVAD);
      break;
    }
    case bitField.has(67108864n): {
      perms.push(lan.permissions.perms.changeNickname);
      break;
    }
    case bitField.has(134217728n): {
      perms.push(lan.permissions.perms.manageNicknames);
      break;
    }
    case bitField.has(268435456n): {
      if (isntRole) {
        perms.push(lan.permissions.perms.managePermissions);
      } else {
        perms.push(lan.permissions.perms.manageRoles);
      }
      break;
    }
    case bitField.has(536870912n): {
      perms.push(lan.permissions.perms.manageWebhooks);
      break;
    }
    case bitField.has(1073741824n): {
      perms.push(lan.permissions.perms.manageEmojisAndStickers);
      break;
    }
    case bitField.has(2147483648n): {
      perms.push(lan.permissions.perms.useApplicationCommands);
      break;
    }
    case bitField.has(4294967296n): {
      perms.push(lan.permissions.perms.voiceRequestToSpeak);
      break;
    }
    case bitField.has(8589934592n): {
      perms.push(lan.permissions.perms.manageEvents);
      break;
    }
    case bitField.has(17179869184n): {
      perms.push(lan.permissions.perms.manageThreads);
      break;
    }
    case bitField.has(34359738368n): {
      perms.push(lan.permissions.perms.createPublicThreads);
      break;
    }
    case bitField.has(68719476736n): {
      perms.push(lan.permissions.perms.createPrivateThreads);
      break;
    }
    case bitField.has(137438953472n): {
      perms.push(lan.permissions.perms.useExternalStickers);
      break;
    }
    case bitField.has(274877906944n): {
      perms.push(lan.permissions.perms.sendMessagesInThreads);
      break;
    }
    case bitField.has(549755813888n): {
      perms.push(lan.permissions.perms.startEmbeddedActivities);
      break;
    }
    case bitField.has(1099511627776n): {
      perms.push(lan.permissions.perms.moderateMembers);
      break;
    }
    default: {
      break;
    }
  }

  return perms;
};
