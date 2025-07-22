import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

type Type =
 | CT.EditorTypes.ShopType
 | CT.EditorTypes.Punishment
 | CT.EditorTypes.Language
 | CT.EditorTypes.AutoPunishment
 | CT.EditorTypes.AntiRaidPunishment
 | CT.EditorTypes.Questions
 | CT.EditorTypes.LvlUpMode
 | CT.EditorTypes.WeekendsType
 | CT.EditorTypes.FormulaType;

export default async (
 cmd: Discord.StringSelectMenuInteraction,
 args: string[],
 type: Type = CT.EditorTypes.ShopType,
) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 cmd.update({
  embeds: [
   await cmd.client.util.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    cmd.values,
    type,
    cmd.guild,
   ),
  ],
 });
};
