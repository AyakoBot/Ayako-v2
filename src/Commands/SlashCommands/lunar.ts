import * as Discord from 'discord.js';
import Lunar from '../../BaseClient/Other/lunar.json' assert { type: 'json' };

export default async (cmd: Discord.ChatInputCommandInteraction) => {
  const ownClaims = Lunar.filter((c) => c.user_id === cmd.user.id);

  cmd.reply({
    embeds: [
      {
        description: ownClaims
          .sort((a, b) => b.c - a.c)
          .map((c) => `\`${c.c} ${c.color} ${c.animal}\``)
          .join('\n'),
      },
    ],
    ephemeral: true,
  });
};
