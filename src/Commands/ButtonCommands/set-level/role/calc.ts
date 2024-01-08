import * as Discord from 'discord.js';
import { getEmbed } from '../../../SlashCommands/settings/leveling/set-level-role.js';
import {
 getLevelComponents,
 getXPComponents,
} from '../../../SlashCommands/settings/leveling/set-level-user.js';
import { getLevel, getXP } from '../user/calc.js';

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

 const component = cmd.message
  .components as Discord.APIActionRowComponent<Discord.APIButtonComponent>[];
 const xpOrLevel = Number(
  cmd.message.embeds[0].fields[type === 'x' ? 0 : 1].value.replace(/,/g, ''),
 );
 const amountToAddOrRemove = Number(component[type === 'x' ? 0 : 1].components[3].label);
 const amountOfZerosOnPrimary =
  Number(component[type === 'x' ? 0 : 1].components[3].label?.length) - 2;
 const amountOfZerosOnSecondary =
  Number(component[type === 'l' ? 0 : 1].components[3].label?.length) - 2;

 const newXpOrLevel =
  xpOrLevel + (addOrRemove === '+' ? amountToAddOrRemove : -amountToAddOrRemove);

 const newLevel = type === 'l' ? newXpOrLevel : getLevel(newXpOrLevel);
 const newXP = type === 'x' ? newXpOrLevel : getXP(newXpOrLevel);

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
    components: cmd.message.components[2].components.map((c) => c.data),
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: cmd.message.components[3].components.map((c) => c.data),
   },
  ],
 });
};
