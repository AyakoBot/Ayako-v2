import Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings';
import { separatorAssigner, oneTimeRunner } from '../../guildEvents/guildMemberUpdate/separator.js';

export default async () => {
  const roleseparatorsettingsRow = await ch
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

    const channel = await ch.getChannel.guildTextChannel(row.channelid);
    if (!channel) return;
    const message = await channel.messages.fetch(row.messageid).catch(() => null);
    if (!message) return;

    Jobs.scheduleJob(new Date(Date.now() + 300000), () => {
      if (!client.user) return;
      oneTimeRunner(
        { guild, author: client.user, channel },
        message,
        {},
        undefined,
        row.index === row.length,
      );
    });
  });
};
