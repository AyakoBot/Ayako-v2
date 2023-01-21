import client from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings';
// TODO
import { oneTimeRunner } from '../../guildEvents/guildMemberUpdate/separator.js';

export default async () => {
  const roleseparatorsettingsRows = (
    await client.ch
      .query('SELECT * FROM roleseparatorsettings WHERE stillrunning = true;')
      .then((r: DBT.roleseparatorsettings[] | null) => r || null)
  )?.filter((r) => client.guilds.cache.has(r.guildid));
  if (!roleseparatorsettingsRows) return;

  roleseparatorsettingsRows.forEach(async (row) => {
    const guild = client.guilds.cache.get(row.guildid);
    if (!guild) return;
    if (!row.channelid) return;
    if (!row.messageid) return;

    const message = await (await client.ch.getChannel.guildTextChannel(row.channelid))?.messages
      .fetch(row.messageid)
      .catch(() => null);
    if (!message) return;

    oneTimeRunner({ guildID: guild.id, author: client.user, channel: message.channel }, message, {
      type: 'rich',
    });
  });
};
