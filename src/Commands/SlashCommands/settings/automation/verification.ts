import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
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
      author: embedParsers.author(language, lan),
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
      components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.boolean(language, settings?.selfstart, 'selfstart', name),
        buttonParsers.specific(language, settings?.startchannel, 'startchannel', name, 'channel'),
        buttonParsers.specific(language, settings?.logchannel, 'logchannel', name, 'channel'),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.pendingrole, 'pendingrole', name, 'role'),
        buttonParsers.specific(language, settings?.finishedrole, 'finishedrole', name, 'role'),
        buttonParsers.boolean(language, settings?.kicktof, 'kicktof', name),
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
