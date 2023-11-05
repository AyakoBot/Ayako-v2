import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import {
 getLevelComponents,
 getXPComponents,
} from '../../../SlashCommands/settings/leveling/set-level-user.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'x' | 'l';
 const addOrRemove = args.shift() as '+' | '-';
 const userId = args.shift() as string;

 const component = cmd.message
  .components as Discord.APIActionRowComponent<Discord.APIButtonComponent>[];
 const amountOfZerosOnPrimary =
  Number(component[type === 'x' ? 0 : 1].components[3].label?.length) - 2;
 const amountOfZerosOnSecondary =
  Number(component[type === 'l' ? 0 : 1].components[3].label?.length) - 2;
 const language = await ch.getLanguage(cmd.guildId);

 if (amountOfZerosOnPrimary > 10) {
  ch.errorCmd(cmd, language.slashCommands.setLevel.maxZeros, language);
  return;
 }

 const newAmountOfZeros =
  addOrRemove === '+' ? amountOfZerosOnPrimary + 1 : amountOfZerosOnPrimary - 1;

 const components = ch.getChunks(
  [
   ...getXPComponents(userId, type === 'x' ? newAmountOfZeros : amountOfZerosOnSecondary, language),
   ...getLevelComponents(
    userId,
    type === 'l' ? newAmountOfZeros : amountOfZerosOnSecondary,
    language,
   ),
  ],
  5,
 );

 cmd.update({
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
