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
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames.verification} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.verification[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.verification;
  const name = 'verification';

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
          name: lan.fields.selfstart.name,
          value: embedParsers.boolean(settings?.selfstart, language),
          inline: true,
        },
        {
          name: lan.fields.startchannel.name,
          value: embedParsers.channel(settings?.startchannel, language),
          inline: true,
        },
        {
          name: lan.fields.logchannel.name,
          value: embedParsers.channel(settings?.logchannel, language),
          inline: true,
        },
        {
          name: lan.fields.pendingrole.name,
          value: embedParsers.role(settings?.pendingrole, language),
          inline: true,
        },
        {
          name: lan.fields.finishedrole.name,
          value: embedParsers.role(settings?.finishedrole, language),
          inline: false,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.kicktof.name,
          value: embedParsers.boolean(settings?.kicktof, language),
          inline: false,
        },
        {
          name: lan.fields.kickafter.name,
          value: embedParsers.time(Number(settings?.kickafter), language),
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
        buttonParsers.specific(language, settings?.selfstart, 'selfstart', name),
        buttonParsers.specific(language, settings?.startchannel, 'startchannel', name, 'channel'),
        buttonParsers.specific(language, settings?.logchannel, 'logchannel', name, 'channel'),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.pendingrole, 'pendingrole', name, 'role'),
        buttonParsers.specific(language, settings?.finishedrole, 'finishedrole', name, 'role'),
        buttonParsers.specific(language, settings?.kicktof, 'kicktof', name),
        buttonParsers.specific(language, settings?.kickafter, 'kickafter', name),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
