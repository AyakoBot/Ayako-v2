import { ButtonInteraction, UserSelectMenuComponent } from 'discord.js';
import changeModal from '../../../../BaseClient/UtilModules/settingsHelpers/changeHelpers/changeModal.js';
import type { SettingNames } from '../../../../Typings/Settings.js';

export default async (cmd: ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.client.util.settingsHelpers.permissionCheck(cmd)) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as SettingNames | undefined;
 if (!settingName) return;

 const uniquetimestamp = args.shift();

 const modal = changeModal(
  language,
  settingName,
  fieldName,
  'string',
  undefined,
  true,
  uniquetimestamp,
  true,
 );

 const selectMenu = cmd.message.components[0].components[0] as UserSelectMenuComponent;
 const valueComponent = modal.components[0].components[0];
 const instructionsComponent = modal.components[1].components[0];

 instructionsComponent.value = language.slashCommands.settings.addByIdInstructionsMulti;
 instructionsComponent.max_length = language.slashCommands.settings.addByIdInstructionsMulti.length;
 instructionsComponent.min_length = language.slashCommands.settings.addByIdInstructionsMulti.length;
 valueComponent.value = selectMenu.data.default_values?.map((v) => v.id).join(', ') ?? undefined;
 modal.custom_id = modal.custom_id.replace('settings/string', 'settings/userIds');

 cmd.showModal(modal);
};
