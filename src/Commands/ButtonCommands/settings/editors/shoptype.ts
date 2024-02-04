import * as Discord from 'discord.js';
import * as S from '../../../../Typings/Settings.js';
import type * as CT from '../../../../Typings/Typings.js';

type Types =
 | S.EditorTypes.Punishment
 | S.EditorTypes.ShopType
 | S.EditorTypes.Language
 | S.EditorTypes.AutoPunishment
 | S.EditorTypes.AntiRaidPunishment
 | S.EditorTypes.Questions
 | S.EditorTypes.LvlUpMode
 | S.EditorTypes.WeekendsType;

export default async (
 cmd: Discord.ButtonInteraction,
 args: string[],
 type: Types = S.EditorTypes.ShopType,
) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as S.SettingNames;
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
  cmd.client,
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
     cmd.client.util.settingsHelpers.changeHelpers.back(
      settingName,
      Number(uniquetimestamp),
      cmd.client,
     ),
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
  case S.EditorTypes.AntiRaidPunishment: {
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
  case S.EditorTypes.AutoPunishment: {
   const obj = structuredClone(language.punishments) as Omit<
    CT.Language['punishments'],
    'strike'
   > & {
    strike?: string;
   };

   delete obj.strike;
   return obj;
  }
  case S.EditorTypes.Punishment:
   return language.punishments;
  case S.EditorTypes.ShopType:
   return language.shoptypes;
  case S.EditorTypes.Language:
   return language.languages;
  case S.EditorTypes.Questions:
   return language.answertypes;
  case S.EditorTypes.LvlUpMode:
   return language.lvlupmodes;
  case S.EditorTypes.WeekendsType:
   return language.weekendstype;
  default:
   return [];
 }
};
