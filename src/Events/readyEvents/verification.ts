import * as ch from '../../BaseClient/ClientHelper.js';
import client from '../../BaseClient/Client.js';
import type DBT from '../../Typings/DataBaseTypings';
import { kick } from '../../Events/guildEvents/guildMemberAdd/verification.js';

export default async () => {
  const verificationRows = await ch
    .query('SELECT * FROM verification WHERE active = true AND kicktof = true;')
    .then((r: DBT.verification[] | null) => r || null);
  if (!verificationRows) return;

  verificationRows.forEach(async (r) => {
    if (!r.kickafter) return;
    if (!r.kicktof) return;
    const guild = client.guilds.cache.get(r.guildid);
    if (!guild) return;

    const language = await ch.languageSelector(guild.id);

    guild.members.cache
      .filter((m) => Date.now() - Number(r.kickafter) > Number(m.joinedTimestamp))
      .forEach((m) => kick(m, r, language));
  });
};
