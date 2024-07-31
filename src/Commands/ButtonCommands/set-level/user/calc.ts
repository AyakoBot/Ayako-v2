import * as Discord from 'discord.js';
import {
 getEmbed,
 getLevelComponents,
 getXPComponents,
} from '../../../SlashCommands/settings/leveling/set-level-user.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'x' | 'l';
 const addOrRemove = args.shift() as '+' | '-';
 const userId = args.shift() as string;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const user = await cmd.client.util.getUser(userId);
 if (!user) {
  cmd.client.util.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const component = getComponents(cmd.message.components);
 const xpOrLevel = Number(
  cmd.message.embeds[0].fields[type === 'x' ? 1 : 4].value.replace(/,/g, ''),
 );
 const amountToAddOrRemove = Number(component[type === 'x' ? 0 : 1].components[3].label);
 const amountOfZerosOnPrimary =
  Number(component[type === 'x' ? 0 : 1].components[3].label?.length) - 2;
 const amountOfZerosOnSecondary =
  Number(component[type === 'l' ? 0 : 1].components[3].label?.length) - 2;

 const newXpOrLevel =
  xpOrLevel + (addOrRemove === '+' ? amountToAddOrRemove : -amountToAddOrRemove);

 const level = await cmd.client.util.DataBase.level.findUnique({
  where: { userid_guildid_type: { guildid: cmd.guildId, userid: user.id, type: 'guild' } },
 });

 const newLevel = type === 'l' ? newXpOrLevel : getLevel(newXpOrLevel);
 const newXP = type === 'x' ? newXpOrLevel : getXP(newXpOrLevel);

 if (newLevel < 0 || newXP < 0) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.setLevel.min, language);
  return;
 }

 const embed = getEmbed(
  user,
  language,
  { xp: Number(level?.xp), level: Number(level?.level) },
  {
   xp: newXP,
   level: newLevel,
  },
 );

 const components = cmd.client.util.getChunks(
  [
   ...getXPComponents(
    userId,
    type === 'x' ? amountOfZerosOnPrimary : amountOfZerosOnSecondary,
    language,
   ),
   ...getLevelComponents(
    userId,
    type === 'l' ? amountOfZerosOnPrimary : amountOfZerosOnSecondary,
    language,
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
  ],
 });
};

export const getLevel = (xp: number) =>
 Math.round(
  (3 ** 0.5 * (3888 * xp ** 2 + 233280 * xp - 3366425) ** 0.5 + 108 * xp + 3240) ** (1 / 3) /
   (2 * 3 ** (2 / 3) * 5 ** (1 / 3)) +
   (65 * (5 / 3) ** (1 / 3)) /
    (2 *
     (3 ** 0.5 * (3888 * xp ** 2 + 233280 * xp - 3366425) ** 0.5 + 108 * xp + 3240) ** (1 / 3)) -
   9 / 2,
 ) || 0;

export const getXP = (level: number) =>
 Math.floor((5 / 6) * level * (2 * level * level + 27 * level + 91));

export const getComponents = (
 components:
  | Discord.ButtonInteraction<'cached'>['message']['components']
  | Discord.APIActionRowComponent<Discord.APIButtonComponent>[],
) =>
 (components as Discord.APIActionRowComponent<Discord.APIButtonComponent>[]).map((c) => ({
  ...c,
  components: c.components.filter(
   (b): b is Discord.APIButtonComponentWithCustomId =>
    'custom_id' in b && b.type === Discord.ComponentType.Button,
  ),
 }));
