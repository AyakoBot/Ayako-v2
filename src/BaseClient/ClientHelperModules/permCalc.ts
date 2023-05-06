import Discord from 'discord.js';
import type CT from '../../Typings/CustomTypings';

export default (bits: bigint, lan: CT.Language, isntRole = false) => {
 const bitField = new Discord.PermissionsBitField(bits);
 const perms = [];

 if (bitField.has(1n, false)) perms.push(lan.permissions.perms.CreateInstantInvite);
 if (bitField.has(2n, false)) perms.push(lan.permissions.perms.KickMembers);
 if (bitField.has(4n, false)) perms.push(lan.permissions.perms.BanMembers);
 if (bitField.has(8n, false)) perms.push(lan.permissions.perms.Administrator);
 if (bitField.has(16n, false)) {
  if (isntRole) perms.push(lan.permissions.perms.ManageChannel);
  else perms.push(lan.permissions.perms.ManageChannels);
 }
 if (bitField.has(32n, false)) perms.push(lan.permissions.perms.ManageGuild);
 if (bitField.has(64n, false)) perms.push(lan.permissions.perms.AddReactions);
 if (bitField.has(128n, false)) perms.push(lan.permissions.perms.ViewAuditLog);
 if (bitField.has(256n, false)) perms.push(lan.permissions.perms.PrioritySpeaker);
 if (bitField.has(512n, false)) perms.push(lan.permissions.perms.Stream);
 if (bitField.has(1024n, false)) {
  if (isntRole) perms.push(lan.permissions.perms.ViewChannel);
  else perms.push(lan.permissions.perms.ViewChannels);
 }
 if (bitField.has(2048n, false)) perms.push(lan.permissions.perms.SendMessages);
 if (bitField.has(4096n, false)) perms.push(lan.permissions.perms.SendTTSMessages);
 if (bitField.has(8192n, false)) perms.push(lan.permissions.perms.ManageMessages);
 if (bitField.has(16384n, false)) perms.push(lan.permissions.perms.EmbedLinks);
 if (bitField.has(32768n, false)) perms.push(lan.permissions.perms.AttachFiles);
 if (bitField.has(65536n, false)) perms.push(lan.permissions.perms.ReadMessageHistory);
 if (bitField.has(131072n, false)) perms.push(lan.permissions.perms.MentionEveryone);
 if (bitField.has(262144n, false)) perms.push(lan.permissions.perms.UseExternalEmojis);
 if (bitField.has(524288n, false)) perms.push(lan.permissions.perms.ViewGuildInsights);
 if (bitField.has(1048576n, false)) perms.push(lan.permissions.perms.Connect);
 if (bitField.has(2097152n, false)) perms.push(lan.permissions.perms.Speak);
 if (bitField.has(4194304n, false)) perms.push(lan.permissions.perms.MuteMembers);
 if (bitField.has(8388608n, false)) perms.push(lan.permissions.perms.DeafenMembers);
 if (bitField.has(16777216n, false)) perms.push(lan.permissions.perms.MoveMembers);
 if (bitField.has(33554432n, false)) perms.push(lan.permissions.perms.UseVAD);
 if (bitField.has(67108864n, false)) perms.push(lan.permissions.perms.ChangeNickname);
 if (bitField.has(134217728n, false)) perms.push(lan.permissions.perms.ManageNicknames);
 if (bitField.has(268435456n, false)) {
  if (isntRole) perms.push(lan.permissions.perms.ManagePermissions);
  else perms.push(lan.permissions.perms.ManageRoles);
 }
 if (bitField.has(536870912n, false)) perms.push(lan.permissions.perms.ManageWebhooks);
 if (bitField.has(1073741824n, false)) perms.push(lan.permissions.perms.ManageEmojisAndStickers);
 if (bitField.has(2147483648n, false)) perms.push(lan.permissions.perms.UseApplicationCommands);
 if (bitField.has(4294967296n, false)) perms.push(lan.permissions.perms.RequestToSpeak);
 if (bitField.has(8589934592n, false)) perms.push(lan.permissions.perms.ManageEvents);
 if (bitField.has(17179869184n, false)) perms.push(lan.permissions.perms.ManageThreads);
 if (bitField.has(34359738368n, false)) perms.push(lan.permissions.perms.CreatePublicThreads);
 if (bitField.has(68719476736n, false)) perms.push(lan.permissions.perms.CreatePrivateThreads);
 if (bitField.has(137438953472n, false)) perms.push(lan.permissions.perms.UseExternalStickers);
 if (bitField.has(274877906944n, false)) perms.push(lan.permissions.perms.SendMessagesInThreads);
 if (bitField.has(549755813888n, false)) perms.push(lan.permissions.perms.UseEmbeddedActivities);
 if (bitField.has(1099511627776n, false)) perms.push(lan.permissions.perms.ModerateMembers);

 return perms;
};
