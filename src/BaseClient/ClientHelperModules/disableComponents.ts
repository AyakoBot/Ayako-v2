import type * as Discord from 'discord.js';
import buttonRower from './buttonRower.js';
import client from '../Client.js';

export default (msg: DDeno.Message, embeds: DDeno.Embed[]) => {
  const rows = msg.components?.map((c1) =>
    c1.components?.map((c2) => {
      if ('style' in c2 && c2.style === 5) return c2;
      c2.disabled = true;
      return c2;
    }),
  );

  if (!rows) return null;

  return client.helpers.editMessage(msg.channelId, msg.id, {
    embeds: embeds || msg.embeds,
    components: buttonRower(rows.filter((r): r is DDeno.ButtonComponent[] => !!r)),
  });
};
