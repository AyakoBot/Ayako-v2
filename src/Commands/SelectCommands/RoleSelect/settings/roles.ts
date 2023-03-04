import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.RoleSelectMenuInteraction, args: string[]) => {
  const fieldName = args.shift();
  if (!fieldName) return;

  const settingName = args.shift();
  if (!settingName) return;

  const language = await ch.languageSelector(cmd.guildId);
  const lan =
    language.slashCommands.settings.categories[
      settingName as keyof typeof language.slashCommands.settings.categories
    ];

  cmd.update({
    embeds: [
      ch.settingsHelpers.changeHelpers.changeEmbed(
        language,
        lan,
        fieldName,
        cmd.roles.map((c) => c.id),
        'role',
      ),
    ],
  });
};
