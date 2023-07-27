import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import client from '../../../../BaseClient/Client.js';

export default async (event: Discord.GuildScheduledEvent, user: Discord.User) => {
 const guild = event.guild ?? (event.guildId ? client.guilds.cache.get(event.guildId) : undefined);
 if (!guild) return;

 const channels = await ch.getLogChannels('scheduledeventevents', guild);
 if (!channels) return;

 const channel =
  event.channel ??
  (event.channelId
   ? (await ch.getChannel.guildTextChannel(event.channelId)) ??
     (await ch.getChannel.guildVoiceChannel(event.channelId))
   : undefined);
 const language = await ch.languageSelector(guild.id);
 const lan = language.events.logs.scheduledEvent;
 const con = ch.constants.events.logs.guild;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameUserRemove,
   icon_url: con.MemberDelete,
  },
  color: ch.constants.colors.danger,
  fields: [],
  description: channel
   ? lan.descUserRemoveChannel(user, event, channel, language.channelTypes[channel.type])
   : lan.descUserRemove(user, event),
  timestamp: new Date().toISOString(),
 };

 ch.send({ id: channels, guildId: guild.id }, { embeds: [embed], files }, undefined, 10000);
};
