import * as Discord from 'discord.js';

export default async (member: Discord.GuildMember) => {
 const settings = await member.client.util.DataBase.sticky.findUnique({
  where: { guildid: member.guild.id, stickypermsactive: true },
 });
 if (!settings) return;

 const me = await member.client.util.getBotMemberFromGuild(member.guild);
 const language = await member.client.util.getLanguage(member.guild.id);

 member.guild.channels.cache.forEach(async (channel) => {
  if (!me?.permissionsIn(channel).has(Discord.PermissionFlagsBits.ManageChannels)) return;
  if (!me?.permissionsIn(channel).has(Discord.PermissionFlagsBits.ManageRoles)) return;

  const sticky = await member.client.util.DataBase.stickypermmembers.findUnique({
   where: { userid_channelid: { userid: member.id, channelid: channel.id } },
  });
  if (!sticky) return;

  member.client.util.request.channels.editPermissionOverwrite(
   channel,
   member.id,
   {
    allow: sticky.allowbits?.toString() ?? null,
    deny: sticky.denybits?.toString() ?? null,
    type: Discord.OverwriteType.Member,
   },
   language.autotypes.stickyperms,
  );
 });
};
