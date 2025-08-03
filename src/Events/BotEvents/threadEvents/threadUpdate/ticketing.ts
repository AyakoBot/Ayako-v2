import type { AnyThreadChannel } from 'discord.js';
import { closeChannel } from '../../../../Commands/ButtonCommands/tickets/close.js';

export default async (channel: AnyThreadChannel) => {
 if (!channel) return;
 if (!channel.archived) return;

 const language = await channel.client.util.getLanguage(channel.guildId);
 if (channel.name.startsWith(`${language.ticketing.closed}-`)) return;

 const settings = await channel.client.util.DataBase.ticketing.findFirst({
  where: { channelId: channel.parentId },
  include: { DMTicket: { where: { channelId: channel.id } } },
 });
 if (!settings) return;

 const payload = await closeChannel(
  channel.guild,
  language,
  channel,
  settings,
  channel.client.user,
  String(settings.uniquetimestamp),
 );

 channel.client.util.send(channel, payload);
};
