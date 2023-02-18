import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories.sticky;
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames.sticky} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.sticky[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const getEmbeds: CT.SettingsFile<'sticky'>['getEmbeds'] = (
  embedParsers,
  settings,
  language,
  lan,
) => [
  {
    author: embedParsers.author(language, lan),
    fields: [
      {
        name: lan.fields.stickypermsactive.name,
        value: embedParsers.boolean(settings?.stickypermsactive, language),
        inline: true,
      },
      {
        name: lan.fields.stickyrolesactive.name,
        value: embedParsers.boolean(settings?.stickyrolesactive, language),
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
      {
        name: lan.fields.stickyrolesmode.name,
        value: settings?.stickyrolesmode
          ? `${ch.stringEmotes.enabled} ${lan.unsticky}`
          : `${ch.stringEmotes.disabled} ${lan.sticky}`,
        inline: false,
      },
      {
        name: lan.fields.roles.name,
        value: embedParsers.roles(settings?.roles, language),
        inline: false,
      },
    ],
  },
];

export const getComponents: CT.SettingsFile<'sticky'>['getComponents'] = (
  buttonParsers,
  settings,
  language,
  name = 'sticky',
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.boolean(language, settings?.stickypermsactive, 'stickypermsactive', name),
      buttonParsers.boolean(language, settings?.stickyrolesactive, 'stickyrolesactive', name),
      buttonParsers.specific(language, settings?.stickyrolesmode, 'stickyrolesmode', name),
      buttonParsers.specific(language, settings?.roles, 'roles', name, 'role'),
    ],
  },
];
