import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Typings.js';
import type * as S from '../../../../Typings/Settings.js';

export default <T extends keyof typeof S.SettingsName2TableName>(
 name: T,
 fieldName: string,
 type: S.EditorTypes | S.AutoModEditorType,
 language: CT.Language,
 uniquetimestamp: number | undefined | string,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Success,
 custom_id: `settings/done/${type}_${String(name)}_${fieldName}_${uniquetimestamp}`,
 label: language.t.Done,
});
