import type { APIEmbed, ModalSubmitInteraction } from 'discord.js';
import { getEmbed as getEmbedRole } from '../../SlashCommands/settings/leveling/set-level-role.js';
import { getEmbed as getEmbedUser } from '../../SlashCommands/settings/leveling/set-level-user.js';
import {
 levelToXP,
 xpToLevel,
} from '../../../Events/BotEvents/messageEvents/messageCreate/levelling.js';
import { FormulaType } from '@prisma/client';

export default async (cmd: ModalSubmitInteraction, args: string[], type: 'xp' | 'lvl' = 'xp') => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 const id = args.shift() as string;
 const roleOrUser = args.shift() as 'role' | 'user';

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const role = cmd.guild.roles.cache.get(id);
 const user = roleOrUser === 'user' ? await cmd.client.util.getUser(id) : null;

 if (roleOrUser === 'role' && !role) {
  cmd.client.util.errorCmd(cmd, language.errors.roleNotFound, language);
  return;
 }

 if (roleOrUser === 'user' && !user) {
  cmd.client.util.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const newAmount = Number(cmd.fields.getTextInputValue('new'));
 if (Number.isNaN(+newAmount)) {
  cmd.client.util.errorCmd(cmd, language.errors.numNaN, language);
  return;
 }

 if (newAmount < 0) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.setLevel.min, language);
  return;
 }

 const getEmbed = async (): Promise<APIEmbed | undefined> => {
  const settings = await cmd.client.util.DataBase.leveling.findUnique({
   where: { guildid: cmd.guildId },
  });

  if (roleOrUser === 'user') {
   if (!user) return undefined;

   const level = await cmd.client.util.DataBase.level.findUnique({
    where: { userid_guildid_type: { guildid: cmd.guildId, userid: user.id, type: 'guild' } },
   });

   return getEmbedUser(
    user,
    language,
    {
     xp: Number(level?.xp || 0),
     level: xpToLevel[settings?.formulaType || FormulaType.polynomial](
      level ? Number(level.xp) : 0,
      settings ? Number(settings.curveModifier) : 100,
     ),
    },
    {
     xp:
      type === 'xp'
       ? newAmount
       : levelToXP[settings?.formulaType || FormulaType.polynomial](
          newAmount,
          settings ? Number(settings.curveModifier) : 100,
         ),
     level:
      type === 'lvl'
       ? newAmount
       : xpToLevel[settings?.formulaType || FormulaType.polynomial](
          newAmount,
          settings ? Number(settings.curveModifier) : 100,
         ),
    },
   );
  }

  if (!role) return undefined;

  const roles = cmd.message.embeds[0].fields[2].value
   .split(', ')
   .map((r) => r.replace(/\D+/g, ''))
   .filter((r) => !!r.length);

  return getEmbedRole(
   language,
   role,
   type === 'xp'
    ? newAmount
    : levelToXP[settings?.formulaType || FormulaType.polynomial](
       newAmount,
       settings ? Number(settings.curveModifier) : 100,
      ),
   type === 'lvl'
    ? newAmount
    : xpToLevel[settings?.formulaType || FormulaType.polynomial](
       newAmount,
       settings ? Number(settings.curveModifier) : 100,
      ),
   roles,
  );
 };

 const embed = await getEmbed();
 if (!embed) return;

 cmd.update({ embeds: [embed] });
};
