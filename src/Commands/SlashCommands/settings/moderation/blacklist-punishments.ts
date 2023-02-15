import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['blacklist-punishments'];

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
  lan: CT.Language['slashCommands']['settings']['categories']['blacklist-punishments'],
) => {
  const { buttonParsers, embedParsers } = client.ch.settingsHelpers;
  const name = 'blacklist-punishments';
  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['blacklist-punishments']} WHERE uniquetimestamp = $1 AND type = $2;`,
      [parseInt(ID, 36), 'blacklist'],
    )
    .then((r: DBT.autopunish[] | null) => (r ? r[0] : null));

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
          name: lan.fields.warnamount.name,
          value: embedParsers.number(settings?.warnamount, language),
          inline: true,
        },
        {
          name: lan.fields.punishment.name,
          value: settings?.punishment
            ? language.punishments[settings?.punishment as keyof typeof language.punishments]
            : language.none,
          inline: true,
        },
        {
          name: lan.fields.duration.name,
          value: embedParsers.time(Number(settings?.duration), language),
          inline: true,
        },
        {
          name: lan.fields.warnamount.name,
          value: embedParsers.number(settings?.warnamount, language),
          inline: true,
        },
      ],
    },
  ];

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.warnamount, 'warnamount', name),
        buttonParsers.specific(language, settings?.punishment, 'punishment', name),
        buttonParsers.specific(language, settings?.duration, 'duration', name),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};

const showAll = async (
  cmd: Discord.ChatInputCommandInteraction,
  language: CT.Language,
  lan: CT.Language['slashCommands']['settings']['categories']['blacklist-punishments'],
) => {
  const name = 'blacklist-punishments';
  const { multiRowHelpers } = client.ch.settingsHelpers;
  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['blacklist-punishments']} WHERE guildid = $1 AND type = $2;`,
      [cmd.guild?.id, 'blacklist'],
    )
    .then((r: DBT.autopunish[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${lan.fields.warnamount.name}: \`${s.warnamount}\` - ${lan.fields.punishment.name}: \`${
      s.punishment
        ? language.punishments[s.punishment as keyof typeof language.punishments]
        : language.none
    }\``,
    value: `${
      s.active ? client.stringEmotes.enabled : client.stringEmotes.disabled
    } - ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
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
