import * as Discord from 'discord.js';
import ms from 'ms';
import * as CT from '../../../../Typings/Typings.js';
import { getWithUTS } from '../buttonParsers/back.js';

export default <T extends keyof typeof CT.SettingsName2TableName>(
 language: CT.Language,
 settingName: T,
 fieldName: string,
 type:
  | 'number'
  | 'duration'
  | 'string'
  | 'strings'
  | 'message'
  | 'autoModRule/string'
  | 'autoModRule/strings'
  | 'autoModRule/duration',
 current: string | undefined,
 short: boolean,
 uniquetimestamp: number | string | undefined,
 required?: boolean,
): Discord.APIModalInteractionResponseCallbackData => ({
 title: (
  language.slashCommands.settings.categories[settingName].fields[fieldName as never] as Record<
   string,
   string
  >
 ).name,
 custom_id: getWithUTS(`settings/${type}_${String(settingName)}`, uniquetimestamp),
 components: [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.TextInput,
     style: short ? Discord.TextInputStyle.Short : Discord.TextInputStyle.Paragraph,
     min_length: required ? 1 : 0,
     max_length: 4000,
     label: language.slashCommands.settings.insertHere,
     value:
      (type === 'duration' && current ? String(ms(Number(current) * 1000)) : current) ?? undefined,
     custom_id: fieldName,
     required: !!required,
    },
   ],
  },
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.TextInput,
     style: Discord.TextInputStyle.Paragraph,
     label: language.slashCommands.settings.acceptedValue,
     custom_id: '-',
     value: (
      language.slashCommands.settings.categories[settingName].fields[fieldName as never] as Record<
       string,
       string
      >
     ).desc,
     max_length: (
      language.slashCommands.settings.categories[settingName].fields[fieldName as never] as Record<
       string,
       string
      >
     ).desc.length,
     min_length: (
      language.slashCommands.settings.categories[settingName].fields[fieldName as never] as Record<
       string,
       string
      >
     ).desc.length,
    },
   ],
  },
 ],
});
