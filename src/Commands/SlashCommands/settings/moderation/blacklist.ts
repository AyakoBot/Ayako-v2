import client from 'BaseClient/Client';
import * as Discord from 'discord.js';

export default async (cmd: Discord.CommandInteraction | Discord.ChatInputCommandInteraction) => {
  if (!cmd.inGuild()) return;

  const language = await client.ch.languageSelector(cmd.guild?.id);
  const subcommandName = cmd.options.data
    .find((c) => c.type === Discord.ApplicationCommandOptionType.SubcommandGroup)
    ?.options?.find((c) => c.type === Discord.ApplicationCommandOptionType.Subcommand)?.name;

  if (!subcommandName) throw new Error('No Sub Command Name found');

  const lan =
    language.slashCommands.settings.categories[
      subcommandName as keyof typeof language.slashCommands.settings.categories
    ];

  cmd.reply({
    embeds: [
      {
        author: {
          icon_url: client.objectEmotes.settings.link,
          name: language.slashCommands.settings.authorType(lan.name),
          url: client.customConstants.standard.invite,
        },
        description: 'desc' in lan ? lan.desc : undefined,
      },
    ],
  });
};
