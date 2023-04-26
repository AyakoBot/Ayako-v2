import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.CommandInteraction) => {
  buildEmbed(cmd);
};

export const buildEmbed = async (cmd: Discord.CommandInteraction | Discord.ButtonInteraction) => {
  const language = await ch.languageSelector(cmd.guildId);
  const lan = language.slashCommands.embedbuilder.create;

  ch.replyCmd(cmd, {
    ephemeral: true,
    embeds: [
      {
        author: {
          name: lan.author,
        },
        description: lan.start.desc,
        color: ch.constants.colors.ephemeral,
      },
    ],
    components: [
      {
        type: Discord.ComponentType.ActionRow,
        components: Object.entries(lan.start.methods).map(([k, v]) => ({
          label: v,
          custom_id: `embed-builder/${k}`,
          type: Discord.ComponentType.Button,
          style: Discord.ButtonStyle.Primary,
        })),
      },
    ],
  });
};
