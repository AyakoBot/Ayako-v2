import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/CustomTypings';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.AutocompleteInteraction) => {
  const subcommandGroup = cmd.options.data.find(
    (c) => c.type === Discord.ApplicationCommandOptionType.SubcommandGroup,
  );
  const subcommand = (subcommandGroup?.options ?? cmd.options.data).find(
    (c) => c.type === Discord.ApplicationCommandOptionType.Subcommand,
  );
  if (!subcommand) return;

  const settingName = subcommand.name as keyof CT.TableNamesMap;

  const tableName = ch.constants.commands.settings.tableNames[
    settingName as keyof typeof ch.constants.commands.settings.tableNames
  ] as keyof CT.TableNamesMap;
  type SettingsType = CT.TableNamesMap[typeof tableName];
};
