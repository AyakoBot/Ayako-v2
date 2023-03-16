import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

const name = 'delete-commands';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories[name];

  const ID = cmd.options.get('id', false)?.value as string;
  if (ID) {
    showID(cmd, ID, language, lan);
    return;
  }
  showAll(cmd, language, lan);
};

export const showID: NonNullable<CT.SettingsFile<typeof name>['showID']> = async (
  cmd,
  ID,
  language,
  lan,
) => {
  const { buttonParsers, embedParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then(async (r: DBT.deletecommands[] | null) =>
      r ? r[0] : await ch.settingsHelpers.runSetup<typeof name>(cmd.guildId, name),
    );

  if (cmd.isButton()) {
    cmd.update({
      embeds: await getEmbeds(embedParsers, settings, language, lan),
      components: await getComponents(buttonParsers, settings, language),
    });
    return;
  }

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

export const showAll: NonNullable<CT.SettingsFile<typeof name>['showAll']> = async (
  cmd,
  language,
  lan,
) => {
  const { embedParsers, multiRowHelpers } = ch.settingsHelpers;
  const settings = await ch
    .query(`SELECT * FROM ${ch.constants.commands.settings.tableNames[name]} WHERE guildid = $1;`, [
      cmd.guild?.id,
    ])
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

  if (cmd.isButton()) {
    cmd.update({
      embeds,
      components,
    });
    return;
  }
  cmd.reply({
    embeds,
    components,
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

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
  buttonParsers,
  settings,
  language,
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.global(
        language,
        !!settings?.active,
        'active',
        name,
        Number(settings?.uniquetimestamp),
      ),
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
        Number(settings?.uniquetimestamp),
      ),
      buttonParsers.specific(
        language,
        settings?.deletetimeout,
        'deletetimeout',
        name,
        Number(settings?.uniquetimestamp),
      ),
      buttonParsers.boolean(
        language,
        settings?.deletecommand,
        'deletecommand',
        name,
        Number(settings?.uniquetimestamp),
      ),
      buttonParsers.boolean(
        language,
        settings?.deletereply,
        'deletereply',
        name,
        Number(settings?.uniquetimestamp),
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
        Number(settings?.uniquetimestamp),
      ),
      buttonParsers.specific(
        language,
        settings?.activechannelid,
        'activechannelid',
        name,
        Number(settings?.uniquetimestamp),
        'channel',
      ),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.back(name, undefined),
      buttonParsers.delete(language, name, Number(settings?.uniquetimestamp)),
    ],
  },
];
