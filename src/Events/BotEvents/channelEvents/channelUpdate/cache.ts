import { StoredPunishmentTypes } from '@prisma/client';
import * as Discord from 'discord.js';

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
  | Discord.AnyThreadChannel
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

 const res = await channel.client.util.DataBase.punishments.findMany({
  where: {
   guildid: channel.guild.id,
   context: channel.id,
   type: StoredPunishmentTypes.tempchannelban,
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
   channel.client.util.DataBase.punishments
    .update({
     where: { uniquetimestamp: data.uniquetimestamp },
     data: { type: StoredPunishmentTypes.channelban },
    })
    .then();
  });
};
