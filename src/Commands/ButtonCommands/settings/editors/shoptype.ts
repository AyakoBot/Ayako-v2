import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

type Types = 'punishment' | 'shoptype' | 'language' | 'auto-punishment' | 'antiraid-punishment';

export default async (cmd: Discord.ButtonInteraction, args: string[], type: Types = 'shoptype') => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as keyof CT.Language['slashCommands']['settings']['categories'];
 if (!settingName) return;

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = await ch.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const language = await ch.getLanguage(cmd.guildId);
 cmd.update({
  embeds: [
   await ch.settingsHelpers.changeHelpers.changeEmbed(
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
     ch.settingsHelpers.changeHelpers.changeSelect(
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
     ch.settingsHelpers.changeHelpers.back(settingName, Number(uniquetimestamp)),
     ch.settingsHelpers.changeHelpers.done(
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
  case 'antiraid-punishment': {
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
  case 'auto-punishment': {
   const obj = structuredClone(language.punishments) as Omit<
    CT.Language['punishments'],
    'strike'
   > & {
    strike?: string;
   };

   delete obj.strike;
   return obj;
  }
  case 'punishment':
   return language.punishments;
  case 'shoptype':
   return language.shoptypes;
  case 'language':
   return language.languages;
  default:
   return [];
 }
};
