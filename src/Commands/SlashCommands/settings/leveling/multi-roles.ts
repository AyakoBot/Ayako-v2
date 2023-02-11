import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';
import type * as CT from '../../../../Typings/CustomTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const lan = language.slashCommands.settings.categories['multi-roles'];

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
  lan: CT.Language['slashCommands']['settings']['categories']['multi-roles'],
) => {
  const { buttonParsers, embedParsers } = client.ch.settingsHelpers;
  const name = 'multi-roles';
  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['multi-roles']} WHERE uniquetimestamp = $1;`,
      [parseInt(ID, 36)],
    )
    .then((r: DBT.levelingmultiroles[] | null) => (r ? r[0] : null));

  const embeds: Discord.APIEmbed[] = [
    {
      author: {
        icon_url: client.objectEmotes.settings.link,
        name: language.slashCommands.settings.authorType(lan.name),
        url: client.customConstants.standard.invite,
      },
      fields: [
        {
          name: lan.fields.roles.name,
          value: embedParsers.roles(settings?.roles, language),
          inline: false,
        },
        {
          name: lan.fields.multiplier.name,
          value: embedParsers.number(settings?.multiplier, language),
          inline: true,
        },
      ],
    },
  ];

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.roles, 'roles', name, 'role'),
        buttonParsers.specific(language, settings?.multiplier, 'multiplier', name),
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
  lan: CT.Language['slashCommands']['settings']['categories']['multi-roles'],
) => {
  const name = 'multi-roles';
  const { buttonParsers } = client.ch.settingsHelpers;
  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['multi-roles']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.levelingmultiroles[] | null) => r || null);

  const fields = settings?.map((s) => ({
    name: `${lan.fields.multiplier.name}: \`${s.multiplier ?? language.none}\``,
    value: `ID: \`${Number(s.uniquetimestamp).toString(36)}\``,
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
