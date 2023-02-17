import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const { embedParsers, buttonParsers } = ch.settingsHelpers;

  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames.suggestions} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.suggestionsettings[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.suggestions;
  const name = 'suggestions';

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
          inline: false,
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
      components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.channelid, 'channelid', name, 'channel'),
        buttonParsers.specific(language, settings?.approverroleid, 'approverroleid', name, 'role'),
        buttonParsers.boolean(language, settings?.anonvote, 'anonvote', name),
        buttonParsers.boolean(language, settings?.anonsuggestion, 'anonsuggestion', name),
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
