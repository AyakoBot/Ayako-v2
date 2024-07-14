import * as Discord from 'discord.js';
import {
 getLevelComponents,
 getXPComponents,
} from '../../../SlashCommands/settings/leveling/set-level-user.js';
import { getComponents } from './calc.js';

export default async (
 cmd: Discord.ButtonInteraction,
 args: string[],
 cmdType: 'user' | 'role' = 'user',
) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'x' | 'l';
 const addOrRemove = args.shift() as '+' | '-';
 const userOrRoleId = args.shift() as string;
 const component = getComponents(cmd.message.components);

 const amountOfZerosOnPrimary =
  Number(component[type === 'x' ? 0 : 1].components[3].label?.length) - 2;
 const amountOfZerosOnSecondary =
  Number(component[type === 'l' ? 0 : 1].components[3].label?.length) - 2;
 const language = await cmd.client.util.getLanguage(cmd.guildId);

 if (amountOfZerosOnPrimary > 10) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.setLevel.maxZeros, language);
  return;
 }

 const newAmountOfZeros =
  addOrRemove === '+' ? amountOfZerosOnPrimary + 1 : amountOfZerosOnPrimary - 1;

 const components = cmd.client.util.getChunks(
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
