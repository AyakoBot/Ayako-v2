import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (event: Discord.GuildScheduledEvent, user: Discord.User) => {
 const guild = event.guild ?? (event.guildId ? client.guilds.cache.get(event.guildId) : undefined);
 if (!guild) return;

 const channels = await event.client.util.getLogChannels('scheduledeventevents', guild);
 if (!channels) return;

 const channel =
  event.channel ??
  (event.channelId
   ? (await event.client.util.getChannel.guildTextChannel(event.channelId)) ??
     (await event.client.util.getChannel.guildVoiceChannel(event.channelId))
   : undefined);
 const language = await event.client.util.getLanguage(guild.id);
 const lan = language.events.logs.scheduledEvent;
 const con = event.client.util.constants.events.logs.guild;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameUserAdd,
   icon_url: con.MemberCreate,
  },
  color: CT.Colors.Success,
  fields: [],
  description: channel
   ? lan.descUserAddChannel(user, event, channel, language.channelTypes[channel.type])
   : lan.descUserAdd(user, event),
  timestamp: new Date().toISOString(),
 };

 event.client.util.send({ id: channels, guildId: guild.id }, { embeds: [embed], files }, 10000);
};
