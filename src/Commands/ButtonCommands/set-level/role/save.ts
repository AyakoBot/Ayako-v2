import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const roleId = args.shift() as string;
 const language = await ch.getLanguage(cmd.guildId);
 const role = cmd.guild.roles.cache.get(roleId);
 if (!role) {
  ch.errorCmd(cmd, language.t.errors.roleNotFound, language);
  return;
 }

 const newXP = Number(cmd.message.embeds[0].fields[0].value.replace(/,/g, ''));
 const newLevel = Number(cmd.message.embeds[0].fields[1].value.replace(/,/g, ''));
 const excluded = cmd.message.embeds[0].fields[2].value
  .split(', ')
  .map((r) => r.replace(/\D+/g, ''))
  .filter((r) => !!r.length);

 role.members
  .filter((r) => !r.roles.cache.hasAny(...excluded))
  .forEach((r) =>
   ch.DataBase.level
    .upsert({
     where: { userid_guildid_type: { guildid: cmd.guildId, userid: r.id, type: 'guild' } },
     update: { xp: newXP, level: newLevel },
     create: { xp: newXP, level: newLevel, userid: r.id, guildid: cmd.guildId, type: 'guild' },
    })
    .then(),
  );

 cmd.update({ components: [], embeds: [getEmbed(language, role, newXP, newLevel, excluded)] });
};

const getEmbed = (
 language: CT.Language,
 role: Discord.Role,
 newXP: number,
 newLevel: number,
 roles: string[],
) => ({
 author: {
  name: language.autotypes.leveling,
 },
 description: language.slashCommands.setLevel.descFinRole(role),
 color: ch.constants.colors.ephemeral,
 fields: [
  {
   name: language.slashCommands.setLevel.newXP,
   value: ch.splitByThousand(newXP),
   inline: true,
  },
  {
   name: language.slashCommands.setLevel.newLvl,
   value: ch.splitByThousand(newLevel),
   inline: true,
  },
  {
   name: language.slashCommands.setLevel.excluded,
   value: roles.length ? roles.map((r) => `<@&${r}>`).join(', ') : language.t.None,
  },
 ],
});
