import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (
 _oldChannel:
  | Discord.CategoryChannel
  | Discord.NewsChannel
  | Discord.StageChannel
  | Discord.TextChannel
  | Discord.PrivateThreadChannel
  | Discord.PublicThreadChannel<boolean>
  | Discord.VoiceChannel
  | Discord.ForumChannel
  | Discord.MediaChannel
  | undefined,
 channel:
  | Discord.CategoryChannel
  | Discord.NewsChannel
  | Discord.StageChannel
  | Discord.TextChannel
  | Discord.AnyThreadChannel<boolean>
  | Discord.VoiceChannel
  | Discord.MediaChannel
  | Discord.ForumChannel,
) => {
 if (channel.isThread()) return;
 if (channel.type === Discord.ChannelType.GuildCategory) return;

 const perms = channel.permissionOverwrites.cache
  .filter((p) => p.type === Discord.OverwriteType.Member)
  .map((o) => o);
 if (!perms?.length) return;

 const res = await ch.DataBase.punish_tempchannelbans.findMany({
  where: {
   guildid: channel.guild.id,
   banchannelid: channel.id,
  },
 });

 if (!res.length) return;

 res
  .filter((r) => {
   const applyingPerm = perms.find((p) => p.id === r.userid);
   if (!applyingPerm) return true;

   return (
    !applyingPerm.deny.has(Discord.PermissionFlagsBits.SendMessages) ||
    !applyingPerm.deny.has(Discord.PermissionFlagsBits.SendMessagesInThreads) ||
    !applyingPerm.deny.has(Discord.PermissionFlagsBits.ViewChannel) ||
    !applyingPerm.deny.has(Discord.PermissionFlagsBits.AddReactions) ||
    !applyingPerm.deny.has(Discord.PermissionFlagsBits.Connect)
   );
  })
  .forEach(async (data) => {
   ch.DataBase.punish_tempchannelbans
    .delete({ where: { uniquetimestamp: data.uniquetimestamp } })
    .then();
   ch.DataBase.punish_channelbans.create({ data }).then();
  });
};
