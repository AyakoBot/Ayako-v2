import type * as Discord from 'discord.js';
import { ch } from '../../../../BaseClient/Client.js';

export default async (event: Discord.GuildScheduledEvent, user: Discord.User) => {
  if (!event.guild) return;

  const channels = await ch.getLogChannels('scheduledeventevents', event.guild);
  if (!channels) return;

  const channel =
    event.channel ??
    (event.channelId
      ? (await ch.getChannel.guildTextChannel(event.channelId)) ??
        (await ch.getChannel.guildVoiceChannel(event.channelId))
      : undefined);
  const language = await ch.languageSelector(event.guild.id);
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
  };

  ch.send({ id: channels, guildId: event.guild.id }, { embeds: [embed], files }, undefined, 10000);
};
