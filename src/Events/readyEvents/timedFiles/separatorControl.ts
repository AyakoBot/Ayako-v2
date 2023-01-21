import Jobs from 'node-schedule';
import client from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings';
// TODO
import { separatorAssigner, oneTimeRunner } from '../../guildEvents/guildMemberUpdate/separator';

export default async () => {
  const roleseparatorsettingsRow = await client.ch
    .query('SELECT * FROM roleseparatorsettings WHERE startat < $1;', [Date.now() - 3900000])
    .then((r: DBT.roleseparatorsettings[] | null) => r || null);
  if (!roleseparatorsettingsRow) return;

  roleseparatorsettingsRow.forEach(async (row) => {
    const guild = client.guilds.cache.get(row.guildid);
    if (!guild) return;

    const existing = separatorAssigner.get(row.guildid);
    if (existing) {
      existing.forEach((e) => e.cancel());
      separatorAssigner.delete(guild.id);
    }

    if (!row.channelid) return;
    if (!row.messageid) return;

    const channel = await client.ch.getChannel.guildTextChannel(row.channelid);
    if (!channel) return;
    const message = await channel.messages.fetch(row.messageid).catch(() => null);
    if (!message) return;

    Jobs.scheduleJob(new Date(Date.now() + 300000), () => {
      oneTimeRunner(
        { guildID: guild.id, author: client.user, channel },
        message,
        {},
        null,
        row.index === row.length,
      );
    });
  });
};
