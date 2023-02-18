import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['auto-roles'];
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['auto-roles']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.autoroles[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: getEmbeds(embedParsers, settings, language, lan),
    components: getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const getEmbeds = (
  embedParsers: (typeof ch)['settingsHelpers']['embedParsers'],
  settings: DBT.autoroles | null,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['auto-roles'],
): Discord.APIEmbed[] => [
  {
    author: embedParsers.author(language, lan),
    fields: [
      {
        name: language.slashCommands.settings.active,
        value: embedParsers.boolean(settings?.active, language),
        inline: false,
      },
      {
        name: lan.fields.botroleid.name,
        value: embedParsers.roles(settings?.botroleid, language),
        inline: true,
      },
      {
        name: lan.fields.userroleid.name,
        value: embedParsers.roles(settings?.userroleid, language),
        inline: true,
      },
      {
        name: lan.fields.allroleid.name,
        value: embedParsers.roles(settings?.allroleid, language),
        inline: true,
      },
    ],
  },
];

export const getComponents = (
  buttonParsers: (typeof ch)['settingsHelpers']['buttonParsers'],
  settings: DBT.autoroles | null,
  language: CT.Language,
  name: 'auto-roles' = 'auto-roles',
): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.botroleid, 'botroleid', name, 'role'),
      buttonParsers.specific(language, settings?.userroleid, 'userroleid', name, 'role'),
      buttonParsers.specific(language, settings?.allroleid, 'allroleid', name, 'role'),
    ],
  },
];
