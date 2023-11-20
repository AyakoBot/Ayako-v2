import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
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

 const language = await ch.getLanguage(cmd.guildId);
 const user = await ch.getUser(userId);
 if (!user) {
  ch.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const component = cmd.message
  .components as Discord.APIActionRowComponent<Discord.APIButtonComponent>[];
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

 const level = await ch.DataBase.level.findUnique({
  where: { userid_guildid_type: { guildid: cmd.guildId, userid: user.id, type: 'guild' } },
 });

 const newLevel = type === 'l' ? newXpOrLevel : getLevel(newXpOrLevel);
 const newXP = type === 'x' ? newXpOrLevel : getXP(newXpOrLevel);

 if (newLevel < 0 || newXP < 0) {
  ch.errorCmd(cmd, language.slashCommands.setLevel.min, language);
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

 const components = ch.getChunks(
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

export const getLevel = (y: number) =>
 Math.round(
  (3 ** 0.5 * (3888 * y ** 2 + 233280 * y - 3366425) ** 0.5 + 108 * y + 3240) ** (1 / 3) /
   (2 * 3 ** (2 / 3) * 5 ** (1 / 3)) +
   (65 * (5 / 3) ** (1 / 3)) /
    (2 * (3 ** 0.5 * (3888 * y ** 2 + 233280 * y - 3366425) ** 0.5 + 108 * y + 3240) ** (1 / 3)) -
   9 / 2,
 ) || 0;

export const getXP = (y: number) => Math.floor((5 / 6) * y * (2 * y * y + 27 * y + 91));
