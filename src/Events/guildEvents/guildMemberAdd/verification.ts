import type * as Discord from 'discord.js';
import { scheduleJob } from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../Typings/DataBaseTypings';
import type * as CT from '../../../Typings/CustomTypings';

export default async (member: Discord.GuildMember) => {
  const verification = await ch
    .query(
      `SELECT * FROM verification WHERE guildid = $1 AND active = true AND pendingrole IS NOT NULL;`,
      [member.guild.id],
    )
    .then((r: DBT.verification[] | null) => (r ? r[0] : null));
  if (!verification) return;

  const language = await ch.languageSelector(member.guild.id);

  preverified(member, verification, language);
  prepKick(member, verification, language);
};

const preverified = async (
  member: Discord.GuildMember,
  verification: DBT.verification,
  language: CT.Language,
) => {
  if (!verification.pendingrole) return;
  ch.roleManager.add(member, [verification.pendingrole], language.verification.log.started, 1);
};

const prepKick = async (
  member: Discord.GuildMember,
  verification: DBT.verification,
  language: CT.Language,
) => {
  if (!verification.kicktof) return;
  if (!verification.kickafter) return;

  scheduleJob(new Date(Date.now() + Number(verification.kickafter)), async () => {
    kick(member, verification, language);
  });
};

export const kick = async (
  member: Discord.GuildMember,
  verification: DBT.verification,
  language: CT.Language,
) => {
  if (!verification.finishedrole) return;
  if (member.roles.cache.has(verification.finishedrole)) return;
  if (!verification.kicktof) return;
  if (!verification.kickafter) return;

  const dm = async () => {
    const channel = await member.user.createDM().catch(() => undefined);
    if (!channel) return;

    ch.send(channel, {
      content: language.verification.kickMsg(member.guild),
    });
  };

  await dm();
  member.kick(language.verification.kickReason).catch(() => undefined);
};
