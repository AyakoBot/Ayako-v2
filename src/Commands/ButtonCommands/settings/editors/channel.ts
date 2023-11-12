import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default async (
 cmd: Discord.ButtonInteraction,
 args: string[],
 channelTypes: 'category' | 'voice' | 'text' = 'text',
) => {
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

 const currentSetting = await ch.settingsHelpers.changeHelpers.get(
  settingName,
  cmd.guildId,
  uniquetimestamp,
 );

 const language = await ch.getLanguage(cmd.guildId);
 cmd.update({
  embeds: [
   await ch.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    currentSetting?.[fieldName as keyof typeof currentSetting],
    'channel',
    cmd.guild,
   ),
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     ch.settingsHelpers.changeHelpers.changeSelectGlobal(
      language,
      'channel',
      fieldName,
      settingName,
      uniquetimestamp,
      channelTypes,
     ),
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     ch.settingsHelpers.changeHelpers.back(settingName, Number(uniquetimestamp)),
     ch.settingsHelpers.changeHelpers.done(
      settingName,
      fieldName,
      'channel',
      language,
      Number(uniquetimestamp),
     ),
    ],
   },
  ],
 });
};
