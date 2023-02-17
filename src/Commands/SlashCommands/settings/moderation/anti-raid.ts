import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const { embedParsers, buttonParsers } = ch.settingsHelpers;

  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames['anti-raid']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.antiraid[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories['anti-raid'];
  const name = 'anti-raid';

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
          name: lan.fields.punishmenttof.name,
          value: embedParsers.boolean(settings?.punishmenttof, language),
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
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.posttof.name,
          value: embedParsers.boolean(settings?.posttof, language),
          inline: true,
        },
        {
          name: lan.fields.postchannel.name,
          value: embedParsers.channel(settings?.postchannel, language),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.time.name,
          value: embedParsers.number(settings?.time, language),
          inline: true,
        },
        {
          name: lan.fields.jointhreshold.name,
          value: embedParsers.number(settings?.jointhreshold, language),
          inline: true,
        },

        {
          name: lan.fields.pingroles.name,
          value: embedParsers.roles(settings?.pingroles, language),
          inline: false,
        },
        {
          name: lan.fields.pingusers.name,
          value: embedParsers.users(settings?.pingusers, language),
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
        buttonParsers.boolean(language, settings?.punishmenttof, 'punishmenttof', name),
        buttonParsers.specific(language, settings?.punishment, 'punishment', name),
        buttonParsers.boolean(language, settings?.posttof, 'posttof', name),
        buttonParsers.specific(language, settings?.postchannel, 'postchannel', name, 'channel'),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.time, 'time', name),
        buttonParsers.specific(language, settings?.jointhreshold, 'jointhreshold', name),
        buttonParsers.specific(language, settings?.pingroles, 'pingroles', name, 'role'),
        buttonParsers.specific(language, settings?.pingusers, 'pingusers', name, 'user'),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
