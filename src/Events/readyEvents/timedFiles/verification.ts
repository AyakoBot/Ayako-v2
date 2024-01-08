import client from '../../../BaseClient/Client.js';
import { kick } from '../../guildEvents/guildMemberAdd/verification.js';

export default async () => {
 const verificationRows = await client.util.DataBase.verification.findMany({
  where: { active: true, kicktof: true },
 });
 if (!verificationRows) return;

 verificationRows.forEach(async (r) => {
  if (!r.kickafter) return;
  if (!r.kicktof) return;

  const guild = client.guilds.cache.get(r.guildid);
  if (!guild) return;

  const language = await client.util.getLanguage(guild.id);

  guild.members.cache
   .filter(
    (m) => Date.now() - Number(r.kickafter) * 1000 > Number(m.joinedTimestamp) && !m.user.bot,
   )
   .forEach((m) => kick(m, r, language));
 });
};
