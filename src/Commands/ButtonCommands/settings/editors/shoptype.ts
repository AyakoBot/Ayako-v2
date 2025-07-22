import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

type Types =
 | CT.EditorTypes.Punishment
 | CT.EditorTypes.ShopType
 | CT.EditorTypes.Language
 | CT.EditorTypes.AutoPunishment
 | CT.EditorTypes.AntiRaidPunishment
 | CT.EditorTypes.Questions
 | CT.EditorTypes.LvlUpMode
 | CT.EditorTypes.WeekendsType
 | CT.EditorTypes.FormulaType;

export default async (
 cmd: Discord.ButtonInteraction,
 args: string[],
 type: Types = CT.EditorTypes.ShopType,
) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.client.util.settingsHelpers.permissionCheck(cmd)) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = await cmd.client.util.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 cmd.update({
  embeds: [
   await cmd.client.util.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    currentSetting?.[fieldName as keyof typeof currentSetting],
    type,
    cmd.guild,
   ),
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     cmd.client.util.settingsHelpers.changeHelpers.changeSelect(
      fieldName,
      settingName,
      type,
      {
       options: Object.entries(getOptions(type, language)).map(([k, v]) => ({
        label: v,
        value: k,
        default: k === currentSetting?.[fieldName as keyof typeof currentSetting],
       })),
      },
      uniquetimestamp,
     ),
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     cmd.client.util.settingsHelpers.changeHelpers.back(settingName, Number(uniquetimestamp)),
     cmd.client.util.settingsHelpers.changeHelpers.done(
      settingName,
      fieldName,
      type,
      language,
      Number(uniquetimestamp),
     ),
    ],
   },
  ],
 });
};

export const getOptions = (type: Types, language: CT.Language) => {
 switch (type) {
  case CT.EditorTypes.AntiRaidPunishment: {
   const obj = structuredClone(language.punishments) as Omit<
    CT.Language['punishments'],
    'strike' | 'warn' | 'tempmute' | 'tempchannelban' | 'channelban' | 'tempban' | 'softban'
   > & {
    strike?: string;
    warn?: string;
    tempmute?: string;
    tempchannelban?: string;
    channelban?: string;
    tempban?: string;
    softban?: string;
   };

   delete obj.strike;
   delete obj.warn;
   delete obj.tempmute;
   delete obj.tempchannelban;
   delete obj.channelban;
   delete obj.tempban;
   delete obj.softban;
   return obj;
  }
  case CT.EditorTypes.AutoPunishment: {
   const obj = structuredClone(language.punishments) as Omit<
    CT.Language['punishments'],
    'strike'
   > & {
    strike?: string;
   };

   delete obj.strike;
   return obj;
  }
  case CT.EditorTypes.Punishment:
   return language.punishments;
  case CT.EditorTypes.ShopType:
   return language.shoptypes;
  case CT.EditorTypes.Language:
   return language.languages;
  case CT.EditorTypes.Questions:
   return language.answertypes;
  case CT.EditorTypes.LvlUpMode:
   return language.lvlupmodes;
  case CT.EditorTypes.WeekendsType:
   return language.weekendstype;
  case CT.EditorTypes.FormulaType:
   return language.formulatypes;
  default:
   return [];
 }
};
