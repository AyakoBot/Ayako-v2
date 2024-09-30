import type { ButtonInteraction } from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const page = Number(args.shift());

 const settingsFile = await cmd.client.util.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;
 if (!settingsFile.showAll) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.settings.categories[settingName];

 settingsFile.showAll(cmd, language, lan, page);
};
