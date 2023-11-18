import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const userId = args.shift() as string;
 const language = await ch.getLanguage(cmd.guildId);
 const user = await ch.getUser(userId);
 if (!user) {
  ch.errorCmd(cmd, language.t.errors.userNotFound, language);
  return;
 }

 const newXP = Number(cmd.message.embeds[0].fields[1].value.replace(/,/g, ''));
 const newLevel = Number(cmd.message.embeds[0].fields[4].value.replace(/,/g, ''));

 ch.DataBase.level
  .upsert({
   where: { userid_guildid_type: { guildid: cmd.guildId, userid: cmd.user.id, type: 'guild' } },
   update: { xp: newXP, level: newLevel },
   create: { xp: newXP, level: newLevel, userid: cmd.user.id, guildid: cmd.guildId, type: 'guild' },
  })
  .then();

 cmd.update({ components: [], embeds: [getEmbed(language, user, newXP, newLevel)] });
};

const getEmbed = (language: CT.Language, u: Discord.User, newXP: number, newLevel: number) => ({
 author: {
  name: language.autotypes.leveling,
 },
 description: language.slashCommands.setLevel.descFinUser(u),
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
 ],
});
