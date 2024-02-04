import type * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Settings.js';

export default async (cmd: Discord.UserSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 cmd.update({
  embeds: [
   await cmd.client.util.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    cmd.users.map((c) => c.id),
    cmd.client.util.CT.EditorTypes.User,
    cmd.guild,
   ),
  ],
 });
};
