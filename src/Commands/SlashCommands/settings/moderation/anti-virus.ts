import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.CommandInteraction | Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const subcommandName = cmd.options.data
    .find((c) => c.type === Discord.ApplicationCommandOptionType.SubcommandGroup)
    ?.options?.find((c) => c.type === Discord.ApplicationCommandOptionType.Subcommand)?.name;
  if (!subcommandName) throw new Error('No Sub-Command Name found');
  const { embedParsers, buttonParsers } = client.ch.settingsHelpers;

  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['anti-virus']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.antivirus[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories['anti-virus'];
  const name = 'anti-virus';

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

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [buttonParsers.global(language, !!settings?.active, name)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.deletetof, 'deletetof', name),
        buttonParsers.specific(language, settings?.delete, 'delete', name),
        buttonParsers.specific(language, settings?.minimizetof, 'minimizetof', name),
        buttonParsers.specific(language, settings?.minimize, 'minimize', name),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.linklogging, 'linklogging', name),
        buttonParsers.specific(language, settings?.linklogchannels, 'linklogchannels', name, 'channel'),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
