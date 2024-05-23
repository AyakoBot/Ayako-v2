import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const settingName = args.shift() as CT.SettingNames;
 if (!settingName) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = await cmd.client.util.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const commandId = (
  cmd.message.embeds[0].description?.includes('/')
   ? client.application?.commands.cache.get(
      cmd.message.embeds[0].description?.replace(/\D+/g, '') as string,
     )?.id
   : (cmd.message.embeds[0].description as string)
 )?.replace(/`/g, '');

 const updatedSetting = await cmd.client.util.settingsHelpers.changeHelpers.getAndInsert(
  settingName,
  fieldName,
  cmd.guildId,
  commandId,
  uniquetimestamp,
 );

 cmd.client.util.settingsHelpers.updateLog(
  { [fieldName]: currentSetting?.[fieldName as keyof typeof currentSetting] },
  { [fieldName]: updatedSetting?.[fieldName as keyof typeof updatedSetting] },
  fieldName as Parameters<(typeof cmd.client.util)['settingsHelpers']['updateLog']>[2],
  settingName,
  uniquetimestamp,
  cmd.guild,
  language,
  language.slashCommands.settings.categories[settingName],
 );

 const settingsFile = await cmd.client.util.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 cmd.update({
  embeds: await settingsFile.getEmbeds(
   cmd.client.util.settingsHelpers.embedParsers,
   updatedSetting,
   language,
   language.slashCommands.settings.categories[settingName],
   cmd.guild,
  ),
  components: await settingsFile.getComponents(
   cmd.client.util.settingsHelpers.buttonParsers,
   updatedSetting,
   language,
  ),
 });
};
