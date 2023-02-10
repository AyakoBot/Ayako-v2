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
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames['disboard-reminders']} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.disboard[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories['disboard-reminders'];
  const name = 'disboard-reminders';

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
          name: lan.fields.deletereply.name,
          value: embedParsers.boolean(settings?.deletereply, language),
          inline: true,
        },
        {
          name: lan.fields.channelid.name,
          value: embedParsers.channel(settings?.channelid, language),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.repeatenabled.name,
          value: embedParsers.boolean(settings?.repeatenabled, language),
          inline: true,
        },
        {
          name: lan.fields.repeatreminder.name,
          value: embedParsers.time(Number(settings?.repeatreminder), language),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: lan.fields.roles.name,
          value: embedParsers.roles(settings?.roles, language),
          inline: true,
        },
        {
          name: lan.fields.users.name,
          value: embedParsers.users(settings?.users, language),
          inline: true,
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
        buttonParsers.specific(language, settings?.deletereply, 'deletereply', name),
        buttonParsers.specific(language, settings?.channelid, 'channelid', name, 'channel'),
        buttonParsers.specific(language, settings?.repeatenabled, 'repeatenabled', name),
        buttonParsers.specific(language, settings?.repeatreminder, 'repeatreminder', name),

      ],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.specific(language, settings?.roles, 'roles', name, 'role'),
        buttonParsers.specific(language, settings?.users, 'users', name, 'user'),

      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
