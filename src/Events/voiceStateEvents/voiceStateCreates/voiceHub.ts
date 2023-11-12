import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (state: Discord.VoiceState, member?: Discord.GuildMember) => {
 if (!member) return;
 if (!state.channel) return;

 const settings = await ch.DataBase.voicehubs.findFirst({
  where: {
   guildid: state.guild.id,
   channelid: state.channel.id,
   active: true,
   categoryid: { not: null },
  },
 });
 if (!settings) return;
 if (!settings.categoryid) return;

 if (!settings.wluserid || !settings.wluserid.includes(member.id)) {
  if (settings.bluserid && settings.bluserid.includes(member.id)) return;
  if (settings.blroleid && member?.roles.cache.some((r) => settings.blroleid.includes(r.id))) {
   return;
  }

  if (settings.wlroleid || !member?.roles.cache.some((r) => settings.wlroleid.includes(r.id))) {
   return;
  }
 }

 const channel = await ch.request.guilds.createChannel(state.guild, {
  parent_id: settings.categoryid,
  name: member.displayName,
  type: Discord.ChannelType.GuildVoice,
  position: state.channel.position + 1,
  permission_overwrites: [
   {
    type: Discord.OverwriteType.Member,
    id: member.id,
    allow: new Discord.PermissionsBitField([
     Discord.PermissionFlagsBits.ManageChannels,
     Discord.PermissionFlagsBits.MoveMembers,
     Discord.PermissionFlagsBits.Connect,
     Discord.PermissionFlagsBits.Speak,
     Discord.PermissionFlagsBits.PrioritySpeaker,
    ]).bitfield.toString(),
   },
   {
    type: Discord.OverwriteType.Role,
    id: state.guild.id,
    deny: new Discord.PermissionsBitField([
     Discord.PermissionFlagsBits.Connect,
    ]).bitfield.toString(),
   },
  ],
 });

 if ('message' in channel) {
  ch.error(state.guild, new Error(channel.message));
  return;
 }

 ch.DataBase.voicechannels
  .create({
   data: {
    channelid: channel.id,
    ownerid: member.id,
    guildid: state.guild.id,
    hubid: state.channel.id,
   },
  })
  .then();
};
