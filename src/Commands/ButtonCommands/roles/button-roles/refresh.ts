import * as Discord from 'discord.js';

export default async (
 cmd: Discord.ButtonInteraction,
 _: string[],
 type: 'button-roles' | 'reaction-roles' = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;

 const reply = await cmd.deferReply({ ephemeral: true });

 cmd.client.util.importCache.Commands.SlashCommands.roles.builders['button-roles'].file.default(
  cmd,
  [],
  reply,
  type,
 );
};
