import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';
import { TicketType } from '@prisma/client';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!cmd.guild) return [];
 const settings = (
  await cmd.guild.client.util.DataBase.ticketing.findMany({ where: { guildid: cmd.guild.id } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await cmd.guild.client.util.getLanguage(cmd.guild.id);

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${language.t.Type}: ${language.ticketingtype[s.type]} - ${
   ([TicketType.dmToThread, TicketType.Thread].includes(s.type) ? s.channelId : s.categoryId)
    ? (
       client.channels.cache.get(
        ([TicketType.dmToThread, TicketType.Thread].includes(s.type)
         ? s.channelId
         : s.categoryId) || '',
       ) as Discord.GuildTextBasedChannel | Discord.CategoryChannel
      )?.name || language.t.None
    : language.t.None
  }`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
