import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['anti-virus'];
  const { embedParsers, buttonParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['anti-virus']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.antivirus[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: getEmbeds(embedParsers, settings, language, lan),
    components: getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const getEmbeds = (
  embedParsers: (typeof ch)['settingsHelpers']['embedParsers'],
  settings: DBT.antivirus | null,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['anti-virus'],
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

const getComponents = (
  buttonParsers: (typeof ch)['settingsHelpers']['buttonParsers'],
  settings: DBT.antivirus | null,
  language: CT.Language,
  name: 'anti-virus' = 'anti-virus',
): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.boolean(language, settings?.deletetof, 'deletetof', name),
      buttonParsers.specific(language, settings?.delete, 'delete', name),
      buttonParsers.boolean(language, settings?.minimizetof, 'minimizetof', name),
      buttonParsers.specific(language, settings?.minimize, 'minimize', name),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.linklogging, 'linklogging', name),
      buttonParsers.specific(
        language,
        settings?.linklogchannels,
        'linklogchannels',
        name,
        'channel',
      ),
    ],
  },
];
