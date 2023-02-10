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
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames.suggestions} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.suggestionsettings[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.suggestions;
  const name = 'suggestions';

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
          name: lan.fields.channelid.name,
          value: embedParsers.channel(settings?.channelid, language),
          inline: true,
        },
        {
          name: lan.fields.approverroleid.name,
          value: embedParsers.roles(settings?.approverroleid, language),
          inline: false,
        },
        {
          name: lan.fields.anonvote.name,
          value: embedParsers.boolean(settings?.anonvote, language),
          inline: true,
        },
        {
          name: lan.fields.anonsuggestion.name,
          value: embedParsers.boolean(settings?.anonsuggestion, language),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false
        },
        {
          name: lan.fields.novoteroles.name,
          value: embedParsers.roles(settings?.novoteroles, language),
          inline: false,
        },
        {
          name: lan.fields.novoteusers.name,
          value: embedParsers.users(settings?.novoteusers, language),
          inline: false,
        },
        {
          name: lan.fields.nosendroles.name,
          value: embedParsers.roles(settings?.nosendroles, language),
          inline: false,
        },
        {
          name: lan.fields.nosendusers.name,
          value: embedParsers.users(settings?.nosendusers, language),
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
        buttonParsers.specific(language, settings?.channelid, 'channelid', name, 'channel'),
        buttonParsers.specific(language, settings?.approverroleid, 'approverroleid', name, 'role'),
        buttonParsers.specific(language, settings?.anonvote, 'anonvote', name),
        buttonParsers.specific(language, settings?.anonsuggestion, 'anonsuggestion', name),
      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.channelid, 'channelid', name, 'channel'),
        buttonParsers.specific(language, settings?.approverroleid, 'approverroleid', name, 'role'),
        buttonParsers.specific(language, settings?.nosendroles, 'nosendroles', name, 'role'),
        buttonParsers.specific(language, settings?.nosendusers, 'nosendusers', name, 'user'),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
