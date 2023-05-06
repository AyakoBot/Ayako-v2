import * as Discord from 'discord.js';
import glob from 'glob';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../../Typings/CustomTypings';
import client from '../../../../BaseClient/Client.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as keyof CT.TableNamesMap;
 if (!settingName) return;

 const tableName = ch.constants.commands.settings.tableNames[
  settingName as keyof typeof ch.constants.commands.settings.tableNames
 ] as keyof CT.TableNamesMap;
 type SettingsType = CT.TableNamesMap[typeof tableName];

 const getUniquetimestamp = () => {
  const arg = args.shift();
  if (arg) return Number(arg);
  return undefined;
 };
 const uniquetimestamp = getUniquetimestamp();

 const currentSetting = (await ch.settingsHelpers.changeHelpers.get(
  tableName,
  fieldName,
  cmd.guildId,
  uniquetimestamp,
 )) as SettingsType;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.settings.categories[settingName];
 const commands: Discord.APISelectMenuOption[] = [
  ...(client.application?.commands.cache
   .filter((c) => c.type === Discord.ApplicationCommandType.ChatInput)
   .map((c) => ({
    label: c.name,
    value: c.id,
    description: language.commandTypes.slashCommands,
   })) ?? []),
  ...(await getStringCommands()).map((c) => ({
   label: c.name,
   value: c.name,
   description: language.commandTypes.textCommands,
  })),
 ];

 cmd.update({
  embeds: [
   await ch.settingsHelpers.changeHelpers.changeEmbed(
    language,
    lan,
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

const getStringCommands = async (): Promise<CT.Command[]> => {
 const files: string[] = await new Promise((resolve) => {
  glob(`${process.cwd()}/Commands/StringCommands/**/*`, (err, res) => {
   if (err) throw err;
   resolve(res);
  });
 });

 return Promise.all(files.filter((f) => f.endsWith('.js')).map((f) => import(f)));
};
