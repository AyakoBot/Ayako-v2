import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';
import type DBT from '../../Typings/DataBaseTypings';
import type CT from '../../Typings/CustomTypings';

export default async () => {
  const verificationRows = await client.ch
    .query('SELECT * FROM verification WHERE active = true AND kicktof = true;')
    .then((r: DBT.verification[] | null) => r || null);
  if (!verificationRows) return;

  verificationRows.forEach(async (r) => {
    if (!r.kickafter) return;
    const guild = client.guilds.cache.get(r.guildid);
    if (!guild) return;

    const language = await client.ch.languageSelector(guild.id);
    const embed = getEmbed(guild, language.verification);

    const unverifiedRoleCheck = () => {
      if (!r.pendingrole) return;
      const unverifiedRole = guild.roles.cache.get(r.pendingrole);
      if (!unverifiedRole) return;

      guild.members.cache
        .filter((m) => m.roles.cache.has(unverifiedRole.id))
        .forEach(async (member) => {
          if (Number(member.joinedAt) >= Math.abs(Date.now() - Number(r.kickafter) * 60000)) return;
          if (member.kickable) {
            const DM = await member.user.createDM().catch(() => null);
            if (DM) await client.ch.send(DM, { embeds: [embed] }, language);

            member.kick(language.verification.kickReason).catch(() => null);
          }
        });
    };

    const noRoleCheck = () => {
      const members = guild.members.cache.filter((m) => m.roles.cache.size === 1);
      members.forEach(async (member) => {
        if (Number(member.joinedAt) >= Math.abs(Date.now() - Number(r.kickafter) * 60000)) return;
        if (member.kickable) {
          const DM = await member.user.createDM().catch(() => null);
          if (DM) await client.ch.send(DM, { embeds: [embed] }, language);

          member.kick(language.verification.kickReason).catch(() => null);
        }
      });
    };

    if (r.pendingrole) unverifiedRoleCheck();
    else noRoleCheck();
  });
};

const getEmbed = (guild: Discord.Guild, lan: CT.Language['verification']): Discord.APIEmbed => ({
  description: lan.kickMsg(guild),
  color: client.customConstants.colors.danger,
});
