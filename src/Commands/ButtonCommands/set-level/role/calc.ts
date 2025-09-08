import * as Discord from 'discord.js';
import { getEmbed } from '../../../SlashCommands/settings/leveling/set-level-role.js';
import {
 getLevelComponents,
 getXPComponents,
} from '../../../SlashCommands/settings/leveling/set-level-user.js';
import {
 levelToXP,
 xpToLevel,
} from '../../../../Events/BotEvents/messageEvents/messageCreate/levelling.js';
import { FormulaType } from '@prisma/client';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'x' | 'l';
 const addOrRemove = args.shift() as '+' | '-';
 const roleId = args.shift() as string;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const role = cmd.guild.roles.cache.get(roleId);
 if (!role) {
  cmd.client.util.errorCmd(cmd, language.errors.roleNotFound, language);
  return;
 }

 const relevantButtonX = (
  cmd.message.components[
   type === 'x' ? 0 : 1
  ] as Discord.ActionRow<Discord.MessageActionRowComponent>
 ).components[3] as Discord.ButtonComponent;
 const relevantButtonL = (
  cmd.message.components[
   type === 'l' ? 0 : 1
  ] as Discord.ActionRow<Discord.MessageActionRowComponent>
 ).components[3] as Discord.ButtonComponent;

 const xpOrLevel = Number(
  cmd.message.embeds[0].fields[type === 'x' ? 0 : 1].value.replace(/,/g, ''),
 );
 const amountToAddOrRemove = Number(relevantButtonX.label);
 const amountOfZerosOnPrimary = Number(relevantButtonX.label?.length) - 2;
 const amountOfZerosOnSecondary = Number(relevantButtonL.label?.length) - 2;

 const newXpOrLevel =
  xpOrLevel + (addOrRemove === '+' ? amountToAddOrRemove : -amountToAddOrRemove);

 const settings = await cmd.client.util.DataBase.leveling.findUnique({
  where: { guildid: cmd.guildId },
 });

 const newLevel =
  type === 'l'
   ? newXpOrLevel
   : xpToLevel[settings?.formulaType || FormulaType.polynomial](
      newXpOrLevel,
      settings ? Number(settings.curveModifier) : 100,
     );
 const newXP =
  type === 'x'
   ? newXpOrLevel
   : levelToXP[settings?.formulaType || FormulaType.polynomial](
      newXpOrLevel,
      settings ? Number(settings.curveModifier) : 100,
     );

 if (newLevel < 0 || newXP < 0) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.setLevel.min, language);
  return;
 }

 const roles = cmd.message.embeds[0].fields[2].value
  .split(', ')
  .map((r) => r.replace(/\D+/g, ''))
  .filter((r) => !!r.length);

 const embed = getEmbed(language, role, newXP, newLevel, roles);

 const components = cmd.client.util.getChunks(
  [
   ...getXPComponents(
    roleId,
    type === 'x' ? amountOfZerosOnPrimary : amountOfZerosOnSecondary,
    language,
    'role',
   ),
   ...getLevelComponents(
    roleId,
    type === 'l' ? amountOfZerosOnPrimary : amountOfZerosOnSecondary,
    language,
    'role',
   ),
  ],
  5,
 );

 cmd.update({
  embeds: [embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: components[0],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: components[1],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: (
     cmd.message.components[2] as Discord.ActionRow<Discord.MessageActionRowComponent>
    ).components.map((c) => c.data),
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: (
     cmd.message.components[3] as Discord.ActionRow<Discord.MessageActionRowComponent>
    ).components.map((c) => c.data),
   },
  ],
 });
};
