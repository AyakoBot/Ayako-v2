import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const subcommandName = cmd.options.data
    .find((c) => c.type === Discord.ApplicationCommandOptionType.SubcommandGroup)
    ?.options?.find((c) => c.type === Discord.ApplicationCommandOptionType.Subcommand)?.name;
  if (!subcommandName) throw new Error('No Sub-Command Name found');
  const { embedParsers, buttonParsers } = client.ch.settingsHelpers;

  const settings = await client.ch
    .query(
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames.expiry} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.expiry[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.expiry;
  const name = 'expiry';

  const embeds: Discord.APIEmbed[] = [
    {
      author: {
        icon_url: client.objectEmotes.settings.link,
        name: language.slashCommands.settings.authorType(lan.name),
        url: client.customConstants.standard.invite,
      },
      fields: [
        {
          name: lan.fields.bans.name,
          value: embedParsers.boolean(settings?.bans, language),
          inline: true,
        },
        {
          name: lan.fields.banstime.name,
          value: embedParsers.time(Number(settings?.banstime), language),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.channelbans.name,
          value: embedParsers.boolean(settings?.channelbans, language),
          inline: true,
        },
        {
          name: lan.fields.channelbanstime.name,
          value: embedParsers.time(Number(settings?.channelbanstime), language),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.kicks.name,
          value: embedParsers.boolean(settings?.kicks, language),
          inline: true,
        },
        {
          name: lan.fields.kickstime.name,
          value: embedParsers.time(Number(settings?.kickstime), language),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.mutes.name,
          value: embedParsers.boolean(settings?.mutes, language),
          inline: true,
        },
        {
          name: lan.fields.mutestime.name,
          value: embedParsers.time(Number(settings?.mutestime), language),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.warns.name,
          value: embedParsers.boolean(settings?.warns, language),
          inline: true,
        },
        {
          name: lan.fields.warnstime.name,
          value: embedParsers.time(Number(settings?.warnstime), language),
          inline: true,
        },
      ],
    },
  ];

  const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.bans, 'bans', name),
        buttonParsers.specific(language, settings?.channelbans, 'channelbans', name),
        buttonParsers.specific(language, settings?.kicks, 'kicks', name),
        buttonParsers.specific(language, settings?.mutes, 'mutes', name),
        buttonParsers.specific(language, settings?.warns, 'warns', name),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.banstime, 'banstime', name),
        buttonParsers.specific(language, settings?.channelbanstime, 'channelbanstime', name),
        buttonParsers.specific(language, settings?.kickstime, 'kickstime', name),
        buttonParsers.specific(language, settings?.mutestime, 'mutestime', name),
        buttonParsers.specific(language, settings?.warnstime, 'warnstime', name),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
