import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../../Typings/CustomTypings';

const name = 'anti-virus';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories[name];
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`, [
      cmd.guild?.id,
    ])
    .then(async (r: CT.TableNamesMap[typeof name][] | null) =>
      r ? r[0] : await ch.settingsHelpers.runSetup<typeof name>(cmd.guildId, name),
    );

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = (
  embedParsers,
  settings,
  language,
  lan,
) => [
  {
    author: embedParsers.author(language, lan),
    fields: [
      {
        name: language.slashCommands.settings.active,
        value: embedParsers.boolean(settings?.active, language),
        inline: false,
      },
      {
        name: lan.fields.usestrike.name,
        value: embedParsers.boolean(settings?.usestrike, language),
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
      {
        name: lan.fields.minimizetof.name,
        value: embedParsers.boolean(settings?.minimizetof, language),
        inline: true,
      },
      {
        name: lan.fields.minimize.name,
        value: embedParsers.number(settings?.minimize, language),
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
      {
        name: lan.fields.deletetof.name,
        value: embedParsers.boolean(settings?.deletetof, language),
        inline: true,
      },
      {
        name: lan.fields.delete.name,
        value: embedParsers.number(settings?.delete, language),
        inline: true,
      },

      {
        name: lan.fields.linklogging.name,
        value: embedParsers.boolean(settings?.linklogging, language),
        inline: false,
      },
      {
        name: lan.fields.linklogchannels.name,
        value: embedParsers.channels(settings?.linklogchannels, language),
        inline: false,
      },
    ],
  },
];

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
  buttonParsers,
  settings,
  language,
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.global(language, !!settings?.active, 'active', name, undefined),
      buttonParsers.boolean(language, settings?.usestrike, 'usestrike', name, undefined),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.boolean(language, settings?.deletetof, 'deletetof', name, undefined),
      buttonParsers.specific(language, settings?.delete, 'delete', name, undefined),
      buttonParsers.boolean(language, settings?.minimizetof, 'minimizetof', name, undefined),
      buttonParsers.specific(language, settings?.minimize, 'minimize', name, undefined),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.boolean(language, settings?.linklogging, 'linklogging', name, undefined),
      buttonParsers.specific(
        language,
        settings?.linklogchannels,
        'linklogchannels',
        name,
        undefined,
        'channel',
      ),
    ],
  },
];
