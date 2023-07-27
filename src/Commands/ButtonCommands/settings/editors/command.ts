import * as Discord from 'discord.js';
import glob from 'glob';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import client from '../../../../BaseClient/Client.js';

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

 const language = await ch.languageSelector(cmd.guildId);

 const commands: Discord.APISelectMenuOption[] = [
  ...(client.application?.commands.cache
   .filter((c) => c.type === Discord.ApplicationCommandType.ChatInput)
   .map((c) => ({
    label: c.name,
    value: c.id,
    description: language.commandTypes.slashCommands,
   })) ?? []),
  ...(await getStringCommands()).map((c) => ({
   label: c,
   value: c,
   description: language.commandTypes.textCommands,
  })),
 ];

 cmd.update({
  embeds: [
   await ch.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    currentSetting?.[fieldName as keyof typeof currentSetting],
    'commands',
   ),
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     ch.settingsHelpers.changeHelpers.changeSelect(
      fieldName,
      settingName,
      'commands',
      {
       options: commands,
      },
      uniquetimestamp,
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
      'commands',
      language,
      Number(uniquetimestamp),
     ),
    ],
   },
  ],
 });
};

const getStringCommands = async (): Promise<string[]> => {
 const files: string[] = await new Promise((resolve) => {
  glob(`${process.cwd()}/Commands/StringCommands/**/*`, (err, res) => {
   if (err) throw err;
   resolve(res);
  });
 });

 return files
  .filter((f) => f.endsWith('.js'))
  .map((f) => f.split('/').pop()?.slice(0, -3) as string);
};
