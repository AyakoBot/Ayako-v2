import * as Discord from 'discord.js';
import { ch } from '../../../../BaseClient/Client.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await ch.languageSelector(cmd.guild?.id);
  const { embedParsers, buttonParsers } = ch.settingsHelpers;

  const settings = await ch
    .query(
      `SELECT * FROM ${ch.constants.commands.settings.tableNames.blacklist} WHERE guildid = $1;`,
      [cmd.guild?.id],
    )
    .then((r: DBT.blacklist[] | null) => (r ? r[0] : null));
  const lan = language.slashCommands.settings.categories.blacklist;
  const name = 'blacklist';

  const embeds: Discord.APIEmbed[] = [
    {
      author: embedParsers.author(language, lan),
      description: settings?.words?.length
        ? `${lan.fields.words.name} ${ch.util.makeCodeBlock(settings.words.join(', '))}`
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
      components: [buttonParsers.global(language, !!settings?.active, 'active', name)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [buttonParsers.specific(language, settings?.words, 'words', name)],
    },
    {
      type: Discord.ComponentType.ActionRow,
      components: [
        buttonParsers.global(language, settings?.wlchannelid, 'wlchannels', name),
        buttonParsers.global(language, settings?.wlroleid, 'wlroles', name),
        buttonParsers.global(language, settings?.wluserid, 'wlusers', name),
      ],
    },
  ];

  cmd.reply({
    embeds,
    components,
    ephemeral: true,
  });
};
