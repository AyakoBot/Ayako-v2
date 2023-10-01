import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _args: string[],
 response?: Discord.InteractionResponse<true>,
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.moderation.permissions;
 const payload = {
  embeds: [
   {
    description: lan.desc,
    color: ch.getColor(),
   },
  ],
  components: (
   ch.getChunks(
    Object.entries(lan.buttons).map(([key, val]) => ({
     type: Discord.ComponentType.Button,
     label: val,
     custom_id: `mod/permissions_${key}`,
     style: cmd.guild.commands.cache.find((c) => c.name === key)
      ? Discord.ButtonStyle.Primary
      : Discord.ButtonStyle.Secondary,
    })),
    5,
   ) as Discord.APIButtonComponentWithCustomId[][]
  ).map((c) => ({
   type: Discord.ComponentType.ActionRow,
   components: c,
  })) as Discord.APIActionRowComponent<Discord.APIButtonComponentWithCustomId>[],
 };

 if (response) await response.delete();

 if (cmd.isButton()) cmd.editReply({ ...payload, message: cmd.message });
 else ch.replyCmd(cmd, payload);
};
