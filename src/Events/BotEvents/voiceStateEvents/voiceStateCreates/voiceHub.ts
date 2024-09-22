import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import { del } from '../voiceStateDeletes/voiceHub.js';
import getPathFromError from '../../../../BaseClient/UtilModules/getPathFromError.js';
import { Language } from '../../../../Typings/Typings.js';

export const memberPermissions = [
 Discord.PermissionFlagsBits.Connect,
 Discord.PermissionFlagsBits.Speak,
 Discord.PermissionFlagsBits.Stream,
 Discord.PermissionFlagsBits.UseVAD,
 Discord.PermissionFlagsBits.SendMessages,
] as const;

export const managerPermissions = [
 ...memberPermissions,
 Discord.PermissionFlagsBits.ManageMessages,
 Discord.PermissionFlagsBits.ManageChannels,
 Discord.PermissionFlagsBits.ManageRoles,
 Discord.PermissionFlagsBits.MuteMembers,
 Discord.PermissionFlagsBits.DeafenMembers,
 Discord.PermissionFlagsBits.PrioritySpeaker,
 Discord.PermissionFlagsBits.ModerateMembers,
] as const;

export default async (state: Discord.VoiceState, member?: Discord.GuildMember) => {
 if (!member) return;
 if (!state.channel) return;

 createVC(state.client, state.guild, state.channel, member);
};

export const createVC = async (
 client: Discord.Client,
 guild: Discord.Guild,
 hub: Discord.VoiceChannel | Discord.StageChannel,
 member: Discord.GuildMember,
): Promise<{ code: number; channel?: Discord.VoiceChannel }> => {
 const settings = await client.util.DataBase.voicehubs.findFirst({
  where: {
   guildid: guild.id,
   channelid: hub.id,
   active: true,
   categoryid: { not: null },
  },
 });
 if (!settings) return { code: 1 };
 if (!settings.categoryid) return { code: 2 };

 if (!settings.wluserid || !settings.wluserid.includes(member.id)) {
  if (settings.bluserid.includes(member.id)) return { code: 3 };
  if (member.roles.cache.some((r) => settings.blroleid.includes(r.id))) {
   return { code: 4 };
  }

  if (
   settings.wlroleid.length &&
   !member.roles.cache.some((r) => settings.wlroleid.includes(r.id))
  ) {
   return { code: 5 };
  }
 }

 const channelsWithParent = member.guild.channels.cache.filter((c) => c.parentId === hub.parentId);
 const lowestChannel = channelsWithParent
  .filter((c): c is Discord.VoiceChannel => c.type === Discord.ChannelType.GuildVoice)
  .sort((a, b) => b.rawPosition - a.rawPosition)
  .first();

 const channel = (await client.util.request.guilds.createChannel(guild, {
  parent_id: settings.categoryid,
  name: member.displayName,
  type: Discord.ChannelType.GuildVoice,
  position: lowestChannel?.rawPosition ?? hub.rawPosition,
  permission_overwrites: [
   {
    id: member.id,
    type: Discord.OverwriteType.Member,
    allow: new Discord.PermissionsBitField(managerPermissions).bitfield.toString(),
   },
   ...(settings.private
    ? [
       {
        id: member.guild.roles.everyone.id,
        type: Discord.OverwriteType.Role,
        deny: new Discord.PermissionsBitField([
         Discord.PermissionFlagsBits.Connect,
        ]).bitfield.toString(),
       },
      ]
    : []),
  ],
 })) as Discord.VoiceChannel | Discord.DiscordAPIError;

 if ('message' in channel) return { code: 6 };

 const language = await client.util.getLanguage(guild.id);

 client.util.DataBase.voicechannels
  .create({
   data: {
    channelid: channel.id,
    ownerid: member.id,
    guildid: guild.id,
    hubid: hub.id,
   },
  })
  .then();

 if (member.voice.channelId) {
  client.util.request.guilds.editMember(member, {
   channel_id: channel.id,
  });
 }

 client.util.DataBase.voicechannels
  .create({
   data: {
    channelid: channel.id,
    ownerid: member.id,
    guildid: guild.id,
    hubid: hub.id,
    everyonelefttime: Date.now(),
   },
  })
  .then();

 client.util.cache.vcDeleteTimeout.set(
  Jobs.scheduleJob(getPathFromError(new Error(channel.id)), new Date(Date.now() + 300000), () =>
   del(channel as NonNullable<typeof hub>),
  ),
  guild.id,
  channel.id,
 );

 const m = await client.util.send(channel, await getPayload(language, member.user, channel));

 if (!m || 'message' in m) return { code: 7, channel };

 return { code: 0, channel };
};

export const getPayload = async (
 language: Language,
 owner: Discord.User,
 channel: Discord.VoiceChannel | Discord.StageChannel,
) => {
 const lan = language.slashCommands.vc.helpEmbed;

 const members = getMembers(channel);
 const memberValue = members.size ? members.map((p) => `<@${p.id}>`).join(', ') : language.t.None;

 const managers = getManagers(channel);
 const managerValue = members.size ? managers.map((p) => `<@${p.id}>`).join(', ') : language.t.None;

 return {
  content: `${owner}`,
  embeds: [
   {
    url: 'https://ayakobot.com?isVoiceHub=true',
    author: { name: language.autotypes.voiceHub },
    description: lan.help(
     (await channel.client.util.getCustomCommand(channel.guild, 'vc'))?.id ?? '0',
    ),
    fields: [
     {
      name: lan.owner,
      value: language.languageFunction.getUser(owner),
      inline: false,
     },
     {
      name: lan.managers,
      value: managerValue.length > 1024 ? `${managers.size} ${lan.managers}` : managerValue,
      inline: false,
     },
     {
      name: lan.members,
      value: memberValue.length > 1024 ? `${members.size} ${lan.members}` : memberValue,
      inline: false,
     },
    ],
   },
  ],
 };
};

export const getManagers = (channel: Discord.VoiceChannel | Discord.StageChannel) =>
 channel.permissionOverwrites.cache.filter(
  (p) => p.type === Discord.OverwriteType.Member && p.allow.has(managerPermissions),
 );

export const getMembers = (channel: Discord.VoiceChannel | Discord.StageChannel) =>
 channel.permissionOverwrites.cache.filter(
  (p) => p.type === Discord.OverwriteType.Member && p.allow.has(memberPermissions),
 );
