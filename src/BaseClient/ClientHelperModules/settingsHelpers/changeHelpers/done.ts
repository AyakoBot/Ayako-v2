import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default <T extends keyof CT.SettingsNames>(
 name: T,
 fieldName: string,
 type: 'channel' | 'channels' | 'role' | 'roles' | 'user' | 'users' | string,
 language: CT.Language,
 uniquetimestamp: number | undefined | string,
): Discord.APIButtonComponent => ({
 type: Discord.ComponentType.Button,
 style: Discord.ButtonStyle.Success,
 custom_id: `settings/done/${type}_${String(name)}_${fieldName}_${uniquetimestamp}`,
 label: language.Done,
});
