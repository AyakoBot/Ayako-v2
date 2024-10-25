import * as Discord from 'discord.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _args: string[],
 response?: Discord.InteractionResponse<true>,
) => {
 if (!cmd.inCachedGuild()) return;

 const reply = await (cmd.isButton() ? undefined : cmd.deferReply({ ephemeral: true }));

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.moderation.permissions;
 const customCommands = await Promise.all(
  Object.keys(lan.buttons).map((k) =>
   cmd.client.util.getCustomCommand(cmd.guild, k as keyof (typeof lan)['buttons']),
  ),
 );

 const payload = {
  embeds: [
   {
    description: lan.desc,
    color: cmd.client.util.getColor(
     cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
    ),
   },
  ],
  components: (
   cmd.client.util.getChunks(
    Object.entries(lan.buttons).map(([key, val], i) => ({
     type: Discord.ComponentType.Button,
     label: val,
     custom_id: `mod/permissions_${key}`,
     style: customCommands[i] ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Secondary,
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
 else (reply as Discord.InteractionResponse).edit(payload);
};
