import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const userId = args.shift() as string;
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const user = await cmd.client.util.getUser(userId);
 if (!user) {
  cmd.client.util.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const newXP = Number(cmd.message.embeds[0].fields[1].value.replace(/,/g, ''));
 const newLevel = Number(cmd.message.embeds[0].fields[4].value.replace(/,/g, ''));

 cmd.client.util.DataBase.level
  .upsert({
   where: { userid_guildid_type: { guildid: cmd.guildId, userid: user.id, type: 'guild' } },
   update: { xp: newXP, level: newLevel },
   create: { xp: newXP, level: newLevel, userid: user.id, guildid: cmd.guildId, type: 'guild' },
  })
  .then();

 cmd.update({ components: [], embeds: [getEmbed(language, user, newXP, newLevel)] });
};

const getEmbed = (language: CT.Language, u: Discord.User, newXP: number, newLevel: number) => ({
 author: {
  name: language.autotypes.leveling,
 },
 description: language.slashCommands.setLevel.descFinUser(u),
 color: CT.Colors.Ephemeral,
 fields: [
  {
   name: language.slashCommands.setLevel.newXP,
   value: u.client.util.splitByThousand(newXP),
   inline: true,
  },
  {
   name: language.slashCommands.setLevel.newLvl,
   value: u.client.util.splitByThousand(newLevel),
   inline: true,
  },
 ],
});
