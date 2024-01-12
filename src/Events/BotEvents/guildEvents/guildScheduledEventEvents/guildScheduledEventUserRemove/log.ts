import type * as Discord from 'discord.js';
import client from '../../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../../Typings/Typings.js';

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
   name: lan.nameUserRemove,
   icon_url: con.MemberDelete,
  },
  color: CT.Colors.Danger,
  fields: [],
  description: channel
   ? lan.descUserRemoveChannel(user, event, channel, language.channelTypes[channel.type])
   : lan.descUserRemove(user, event),
  timestamp: new Date().toISOString(),
 };

 event.client.util.send({ id: channels, guildId: guild.id }, { embeds: [embed], files }, 10000);
};
