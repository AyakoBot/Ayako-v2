import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { del } from '../voiceStateDeletes/voiceHub.js';

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
  if (settings.bluserid.includes(member.id)) return;
  if (member.roles.cache.some((r) => settings.blroleid.includes(r.id))) {
   return;
  }

  if (
   settings.wlroleid.length &&
   !member.roles.cache.some((r) => settings.wlroleid.includes(r.id))
  ) {
   return;
  }
 }

 const channel = (await ch.request.guilds.createChannel(state.guild, {
  parent_id: settings.categoryid,
  name: member.displayName,
  type: Discord.ChannelType.GuildVoice,
  position: state.channel.position + 1,
  permission_overwrites: [
   {
    id: member.id,
    type: Discord.OverwriteType.Member,
    allow: new Discord.PermissionsBitField([
     Discord.PermissionFlagsBits.Connect,
     Discord.PermissionFlagsBits.ManageChannels,
     Discord.PermissionFlagsBits.Speak,
     Discord.PermissionFlagsBits.PrioritySpeaker,
     Discord.PermissionFlagsBits.DeafenMembers,
     Discord.PermissionFlagsBits.MuteMembers,
    ]).bitfield.toString(),
   },
   {
    id: member.guild.roles.everyone.id,
    type: Discord.OverwriteType.Role,
    deny: new Discord.PermissionsBitField([
     Discord.PermissionFlagsBits.Connect,
    ]).bitfield.toString(),
   },
  ],
 })) as Discord.VoiceChannel | Discord.DiscordAPIError;

 if ('message' in channel) return;

 const language = await ch.getLanguage(state.guild.id);
 ch.send(channel, {
  content: `${member}`,
  embeds: [
   {
    author: {
     name: language.autotypes.voiceHub,
    },
    description: language.t.voiceHub(member.user),
    color: ch.getColor(await ch.getBotIdFromGuild(state.guild)),
   },
  ],
  allowed_mentions: {
   users: [member.id],
  },
 });

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

 const data = {
  channelid: channel.id,
  ownerid: member.id,
  guildid: state.guild.id,
  hubid: state.channel.id,
  everyonelefttime: Date.now(),
 };

 const move = await ch.request.guilds.editMember( member, {
  channel_id: channel.id,
 });
 if (!('message' in move)) {
  ch.DataBase.voicechannels.create({ data }).then();
  return;
 }

 ch.DataBase.voicechannels.create({ data }).then();

 ch.cache.vcDeleteTimeout.set(
  Jobs.scheduleJob(new Date(Date.now() + 300000), () =>
   del(channel as NonNullable<typeof state.channel>),
  ),
  state.guild.id,
  channel.id,
 );
};
