import * as Discord from 'discord.js';
import type * as S from '../../../../Typings/Settings.js';

export default <T extends keyof typeof S.SettingsName2TableName>(
 name: T,
 fieldName: string,
 client: Discord.Client,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Danger,
 custom_id: `settings/modal_${String(name)}_${fieldName}`,
 emoji: client.util.emotes.back,
});
