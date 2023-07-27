import type * as Discord from 'discord.js';
import crypto from 'crypto';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as keyof CT.Language['slashCommands']['settings']['categories'];
 if (!settingName) return;


 

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = (await ch.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 ));

 const newSetting = crypto.randomUUID();

 const updatedSetting = (await ch.settingsHelpers.changeHelpers.getAndInsert(
  settingName,
  fieldName,
  cmd.guildId,
  newSetting,
  uniquetimestamp,
 ));

 ch.settingsHelpers.updateLog(
  currentSetting,
  { [fieldName]: updatedSetting?.[fieldName as keyof typeof updatedSetting] },
  fieldName,
  settingName,
  uniquetimestamp,
 );

 const settingsFile = await ch.settingsHelpers.getSettingsFile(settingName, cmd.guild);
 if (!settingsFile) return;

 const language = await ch.languageSelector(cmd.guildId);

 cmd.update({
  embeds: await settingsFile.getEmbeds(
   ch.settingsHelpers.embedParsers,
   updatedSetting,
   language,
   language.slashCommands.settings.categories[settingName],
  ),
  components: await settingsFile.getComponents(
   ch.settingsHelpers.buttonParsers,
   updatedSetting,
   language,
  ),
 });
};
