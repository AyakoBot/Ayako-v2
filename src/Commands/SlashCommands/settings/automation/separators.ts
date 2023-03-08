import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories.separators;

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
  lan: CT.Language['slashCommands']['settings']['categories']['separators'],
) => {
  const { buttonParsers, embedParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames.separators} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.roleseparator[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

const showAll = async (
  cmd: Discord.ChatInputCommandInteraction,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['separators'],
) => {
  const name = 'separators';
  const { multiRowHelpers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['separators']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.roleseparator[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
    value: `${lan.fields.separator.name}: <@&${s.separator}>`,
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

export const getEmbeds: CT.SettingsFile<'separators'>['getEmbeds'] = (
  embedParsers,
  settings,
  language,
  lan,
) => {
  const embeds: Discord.APIEmbed[] = [
    {
      author: embedParsers.author(language, lan),
      fields: [
        {
          name: language.slashCommands.settings.active,
          value: embedParsers.boolean(settings?.active, language),
          inline: false,
        },
        {
          name: lan.fields.separator.name,
          value: embedParsers.role(settings?.separator, language),
          inline: true,
        },
        {
          name: lan.fields.isvarying.name,
          value: embedParsers.boolean(settings?.isvarying, language),
          inline: true,
        },
      ],
    },
  ];

  if (settings?.isvarying) {
    embeds[0].fields?.push({
      name: lan.fields.stoprole.name,
      value: embedParsers.role(settings?.stoprole, language),
      inline: true,
    });
  } else {
    embeds[0].fields?.push({
      name: lan.fields.roles.name,
      value: embedParsers.roles(settings?.roles, language),
      inline: true,
    });
  }

  return embeds;
};

export const getComponents: CT.SettingsFile<'separators'>['getComponents'] = (
  buttonParsers,
  settings,
  language,
  name = 'separators',
) => {
  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.global(
          language,
          !!settings?.active,
          'active',
          name,
          settings?.uniquetimestamp,
        ),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(
          language,
          settings?.separator,
          'separator',
          name,
          settings?.uniquetimestamp,
          'role',
        ),
        buttonParsers.boolean(
          language,
          settings?.isvarying,
          'isvarying',
          name,
          settings?.uniquetimestamp,
        ),
      ],
    },
  ];

  if (settings?.isvarying) {
    components[1].components.push(
      buttonParsers.specific(
        language,
        settings?.stoprole,
        'stoprole',
        name,
        settings?.uniquetimestamp,
        'role',
      ),
    );
  } else {
    components[1].components.push(
      buttonParsers.specific(
        language,
        settings?.roles,
        'roles',
        name,
        settings?.uniquetimestamp,
        'role',
      ),
    );
  }

  return components;
};
