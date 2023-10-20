import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

type Types = 'punishment' | 'shoptype' | 'language';

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
