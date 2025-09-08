import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const roleId = args.shift() as string;
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const role = cmd.guild.roles.cache.get(roleId);
 if (!role) {
  cmd.client.util.errorCmd(cmd, language.errors.roleNotFound, language);
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
   cmd.client.util.DataBase.level
    .upsert({
     where: { userid_guildid_type: { guildid: cmd.guildId, userid: r.id, type: 'guild' } },
     update: { xp: newXP },
     create: { xp: newXP, userid: r.id, guildid: cmd.guildId, type: 'guild' },
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
 color: CT.Colors.Ephemeral,
 fields: [
  {
   name: language.slashCommands.setLevel.newXP,
   value: role.client.util.splitByThousand(newXP),
   inline: true,
  },
  {
   name: language.slashCommands.setLevel.newLvl,
   value: role.client.util.splitByThousand(newLevel),
   inline: true,
  },
  {
   name: language.slashCommands.setLevel.excluded,
   value: roles.length ? roles.map((r) => `<@&${r}>`).join(', ') : language.t.None,
  },
 ],
});
