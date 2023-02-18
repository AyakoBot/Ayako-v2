import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories.cooldowns;

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
  lan: CT.Language['slashCommands']['settings']['categories']['cooldowns'],
) => {
  const { buttonParsers, embedParsers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['cooldowns']} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.cooldowns[] | null) => (r ? r[0] : null));

  cmd.reply({
    embeds: await getEmbeds(embedParsers, settings, language, lan),
    components: await getComponents(buttonParsers, settings, language),
    ephemeral: true,
  });
};

const showAll = async (
  cmd: Discord.ChatInputCommandInteraction,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['cooldowns'],
) => {
  const name = 'cooldowns';
  const { embedParsers, multiRowHelpers } = ch.settingsHelpers;
  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['cooldowns']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.cooldowns[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${lan.fields.command.name}: \`${s.command ?? language.none}\` - ${
      lan.fields.cooldown
    }: \`${embedParsers.time(Number(s.cooldown), language)}\``,
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

export const getEmbeds: CT.SettingsFile<'cooldowns'>['getEmbeds'] = (
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
        value: settings?.command ?? language.none,
        inline: true,
      },
      {
        name: lan.fields.cooldown.name,
        value: embedParsers.time(Number(settings?.cooldown), language),
        inline: true,
      },
      {
        name: lan.fields.activechannelid.name,
        value: embedParsers.channels(settings?.activechannelid, language),
        inline: false,
      },
      {
        name: language.slashCommands.settings.wlchannel,
        value: embedParsers.channels(settings?.wlchannelid, language),
        inline: false,
      },
      {
        name: language.slashCommands.settings.wlrole,
        value: embedParsers.roles(settings?.wlroleid, language),
        inline: false,
      },
      {
        name: language.slashCommands.settings.wluser,
        value: embedParsers.users(settings?.wluserid, language),
        inline: false,
      },
    ],
  },
];

export const getComponents: CT.SettingsFile<'cooldowns'>['getComponents'] = (
  buttonParsers,
  settings,
  language,
  name = 'cooldowns',
) => [
  {
    type: Discord.ComponentType.ActionRow,
    components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(language, settings?.command, 'command', name),
      buttonParsers.specific(language, settings?.cooldown, 'cooldown', name),
    ],
  },
  {
    type: Discord.ComponentType.ActionRow,
    components: [
      buttonParsers.specific(
        language,
        settings?.activechannelid,
        'activechannelid',
        name,
        'channel',
      ),
      buttonParsers.specific(language, settings?.wlchannelid, 'wlchannelid', name, 'channel'),
      buttonParsers.specific(language, settings?.wlroleid, 'wlroleid', name, 'role'),
      buttonParsers.specific(language, settings?.wluserid, 'wluserid', name, 'user'),
    ],
  },
];
