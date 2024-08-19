import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import { getWithUTS } from '../buttonParsers/back.js';

export default <T extends keyof typeof CT.SettingsName2TableName>(
 name: T,
 fieldName: string,
 type: CT.EditorTypes | CT.AutoModEditorType,
 language: CT.Language,
 uniquetimestamp: number | undefined | string,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Success,
 custom_id: getWithUTS(`settings/done/${type}_${String(name)}_${fieldName}`, uniquetimestamp),
 label: language.t.Done,
});
