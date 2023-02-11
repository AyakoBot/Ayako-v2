import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['auto-punish'];

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
  lan: CT.Language['slashCommands']['settings']['categories']['auto-punish'],
) => {
  const { buttonParsers, embedParsers } = client.ch.settingsHelpers;
  const name = 'auto-punish';
  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['auto-punish']} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.autopunish[] | null) => (r ? r[0] : null));

  const embeds: Discord.APIEmbed[] = [
    {
      author: {
        icon_url: client.objectEmotes.settings.link,
        name: language.slashCommands.settings.authorType(lan.name),
        url: client.customConstants.standard.invite,
      },
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
          name: lan.fields.confirmationreq.name,
          value: embedParsers.boolean(settings?.confirmationreq, language),
          inline: true,
        },
        {
          name: lan.fields.punishmentawaittime.name,
          value: embedParsers.time(Number(settings?.punishmentawaittime), language),
          inline: true,
        },
        {
          name: lan.fields.addroles.name,
          value: embedParsers.roles(settings?.addroles, language),
          inline: false,
        },
        {
          name: lan.fields.removeroles.name,
          value: embedParsers.roles(settings?.removeroles, language),
          inline: false,
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
        buttonParsers.boolean(language, settings?.confirmationreq, 'confirmationreq', name),
        buttonParsers.specific(
          language,
          settings?.punishmentawaittime,
          'punishmentawaittime',
          name,
        ),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.addroles, 'addroles', name, 'role'),
        buttonParsers.specific(language, settings?.removeroles, 'removeroles', name, 'channel'),
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
  lan: CT.Language['slashCommands']['settings']['categories']['auto-punish'],
) => {
  const name = 'auto-punish';
  const { buttonParsers } = client.ch.settingsHelpers;
  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['auto-punish']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.autopunish[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${lan.fields.warnamount.name}: \`${s.warnamount}\` - ${lan.fields.punishment.name}: \`${
      s.punishment
        ? language.punishments[s.punishment as keyof typeof language.punishments]
        : language.none
    }\``,
    value: `${s.active ? client.stringEmotes.enabled : client.stringEmotes.disabled} - ID: \`${Number(
      s.uniquetimestamp,
    ).toString(36)}\``,
  }));

  const embeds: Discord.APIEmbed[] = [
    {
      author: {
        icon_url: client.objectEmotes.settings.link,
        name: language.slashCommands.settings.authorType(lan.name),
        url: client.customConstants.standard.invite,
      },
      fields: fields?.splice(0, 24) ?? [],
    },
  ];

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [buttonParsers.delete(language, name), buttonParsers.create(language, name)],
    },
  ];

  if (Number(fields?.length) > 25) {
    components.unshift({
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.previous(language, name),
        buttonParsers.next(language, name, true),
      ],
    });
  }

  if (!fields?.length) {
    embeds[0].fields?.push({
      name: '\u200b',
      value: language.slashCommands.settings.noFields,
      inline: false,
    });
  }

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
