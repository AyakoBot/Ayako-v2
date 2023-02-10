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
      `SELECT * FROM ${client.customConstants.commands.settings.tableNames.blacklist} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.blacklist[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.blacklist;
  const name = 'blacklist';

  const embeds: Discord.APIEmbed[] = [
    {
      author: {
        icon_url: client.objectEmotes.settings.link,
        name: language.slashCommands.settings.authorType(lan.name),
        url: client.customConstants.standard.invite,
      },
      description: settings?.words?.length
        ? `${lan.fields.words.name} ${client.ch.util.makeCodeBlock(settings.words.join(', '))}`
        : language.none,
      fields: [
        {
          name: language.slashCommands.settings.active,
          value: embedParsers.boolean(settings?.active, language),
          inline: false,
        },
        {
          name: language.slashCommands.settings.wlchannel,
          value: embedParsers.channels(settings?.wlchannelid, language),
          inline: false,
        },
        {
          name: language.slashCommands.settings.wlrole,
          value: embedParsers.roles(settings?.wlroleid, language),
          inline: false,
        },
        {
          name: language.slashCommands.settings.wluser,
          value: embedParsers.users(settings?.wluserid, language),
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
      components: [buttonParsers.specific(language, settings?.words, 'words', name)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.global(language, settings?.wlchannelid, 'wlchannelid', 'wlchannel'),
        buttonParsers.global(language, settings?.wlroleid, 'wlroleid', 'wlrole'),
        buttonParsers.global(language, settings?.wluserid, 'wluserid', 'wluser'),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
