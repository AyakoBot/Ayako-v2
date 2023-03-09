import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['delete-commands'];

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
  lan: CT.Language['slashCommands']['settings']['categories']['delete-commands'],
) => {
  const { buttonParsers, embedParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['delete-commands']} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.deletecommands[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

const showAll = async (
  cmd: Discord.ChatInputCommandInteraction,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['delete-commands'],
) => {
  const name = 'delete-commands';
  const { embedParsers, multiRowHelpers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['delete-commands']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.deletecommands[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${lan.fields.command.name}: \`${s.command ?? language.None}\` - ${
      lan.fields.deletetimeout
    }: \`${embedParsers.time(Number(s.deletetimeout), language)}\``,
    value: `${s.active ? ch.stringEmotes.enabled : ch.stringEmotes.disabled} - ID: \`${Number(
      s.uniquetimestamp,
    ).toString(36)}\``,
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

export const getEmbeds: CT.SettingsFile<'delete-commands'>['getEmbeds'] = (
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
        name: lan.fields.command.name,
        value: settings?.command ?? language.None,
        inline: true,
      },
      {
        name: lan.fields.deletetimeout.name,
        value: embedParsers.time(Number(settings?.deletetimeout), language),
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
      {
        name: lan.fields.deletecommand.name,
        value: embedParsers.boolean(settings?.deletecommand, language),
        inline: true,
      },
      {
        name: lan.fields.deletereply.name,
        value: embedParsers.boolean(settings?.deletereply, language),
        inline: true,
      },
      {
        name: language.slashCommands.settings.wlchannel,
        value: embedParsers.channels(settings?.wlchannelid, language),
        inline: false,
      },
      {
        name: lan.fields.activechannelid.name,
        value: embedParsers.channels(settings?.activechannelid, language),
        inline: false,
      },
    ],
  },
];

export const getComponents: CT.SettingsFile<'delete-commands'>['getComponents'] = (
  buttonParsers,
  settings,
  language,
  name = 'delete-commands',
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.global(language, !!settings?.active, 'active', name, settings?.uniquetimestamp),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(
        language,
        settings?.command,
        'command',
        name,
        settings?.uniquetimestamp,
      ),
      buttonParsers.specific(
        language,
        settings?.deletetimeout,
        'deletetimeout',
        name,
        settings?.uniquetimestamp,
      ),
      buttonParsers.boolean(
        language,
        settings?.deletecommand,
        'deletecommand',
        name,
        settings?.uniquetimestamp,
      ),
      buttonParsers.boolean(
        language,
        settings?.deletereply,
        'deletereply',
        name,
        settings?.uniquetimestamp,
      ),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.global(
        language,
        settings?.wlchannelid,
        'wlchannelid',
        name,
        settings?.uniquetimestamp,
      ),
      buttonParsers.specific(
        language,
        settings?.activechannelid,
        'activechannelid',
        name,
        'channel',
      ),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.delete(language, name, Number(settings?.uniquetimestamp))],
  },
];
