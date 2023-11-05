import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import {
 getLevelComponents,
 getXPComponents,
} from '../../../SlashCommands/settings/leveling/set-level-user.js';

export default async (
 cmd: Discord.ButtonInteraction,
 args: string[],
 cmdType: 'user' | 'role' = 'user',
) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'x' | 'l';
 const addOrRemove = args.shift() as '+' | '-';
 const userOrRoleId = args.shift() as string;

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
   ...getXPComponents(
    userOrRoleId,
    type === 'x' ? newAmountOfZeros : amountOfZerosOnSecondary,
    language,
    cmdType,
   ),
   ...getLevelComponents(
    userOrRoleId,
    type === 'l' ? newAmountOfZeros : amountOfZerosOnSecondary,
    language,
    cmdType,
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
   ...(cmdType === 'role'
    ? ([
       {
        type: Discord.ComponentType.ActionRow,
        components: cmd.message.components[3].components.map((c) => c.data),
       },
      ] as const)
    : []),
  ],
 });
};
