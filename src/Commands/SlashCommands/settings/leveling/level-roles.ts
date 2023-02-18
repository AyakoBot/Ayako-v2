import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['level-roles'];

  const ID = cmd.options.get('ID', false)?.value as string;
  if (ID) {
    showID(cmd, ID, language, lan);
    return;
  }
  showAll(cmd, language, lan);
};

const showID = async (
  cmd: Discord.ChatInputCommandInteraction,
  ID: string,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['level-roles'],
) => {
  const { buttonParsers, embedParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['level-roles']} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.levelingroles[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

const showAll = async (
  cmd: Discord.ChatInputCommandInteraction,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['level-roles'],
) => {
  const name = 'level-roles';
  const { multiRowHelpers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['level-roles']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.levelingroles[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${lan.fields.level.name}: \`${s.level ?? language.none}\``,
    value: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
  }));

  const embeds = multiRowHelpers.embeds(fields, language, lan);
  const components = multiRowHelpers.options(language, name);
  multiRowHelpers.noFields(embeds, language);
  multiRowHelpers.components(embeds, components, language, name);

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};

export const getEmbeds: CT.SettingsFile<'level-roles'>['getEmbeds'] = (
  embedParsers,
  settings,
  language,
  lan,
) => [
  {
    author: embedParsers.author(language, lan),
    fields: [
      {
        name: lan.fields.roles.name,
        value: embedParsers.roles(settings?.roles, language),
        inline: false,
      },
      {
        name: lan.fields.level.name,
        value: embedParsers.number(settings?.level, language),
        inline: true,
      },
    ],
  },
];

export const getComponents: CT.SettingsFile<'level-roles'>['getComponents'] = (
  buttonParsers,
  settings,
  language,
  name = 'level-roles',
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.roles, 'roles', name, 'role'),
      buttonParsers.specific(language, settings?.level, 'level', name),
    ],
  },
];
