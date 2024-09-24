import {
 type APIButtonComponentWithCustomId,
 ButtonStyle,
 Client,
 ComponentType,
} from 'discord.js';
import { type Language, SettingsName2TableName } from '../../../../Typings/Typings.js';
import { getWithUTS } from '../buttonParsers/back.js';

export default <T extends keyof typeof SettingsName2TableName>(
 language: Language,
 settingName: T,
 fieldName: string,
 client: Client<true>,
 many: boolean = true,
): APIButtonComponentWithCustomId => ({
 type: ComponentType.Button,
 style: ButtonStyle.Secondary,
 custom_id: getWithUTS(
  `settings/editors/userId${many ? 's' : ''}_${fieldName}_${settingName}`,
  undefined,
 ),
 label: language.slashCommands.settings.addById,
 emoji: client.util.emotes.MemberBright,
});
