import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import { getWithUTS } from '../buttonParsers/back.js';

export default <T extends keyof typeof CT.SettingsName2TableName>(
 name: T,
 fieldName: string,
 type: 'array' | 'autoModRule/array',
 language: CT.Language,
 uniquetimestamp: number | undefined | string,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Danger,
 custom_id: getWithUTS(`settings/empty/${type}_${String(name)}_${fieldName}`, uniquetimestamp),
 label: language.t.Empty,
});
