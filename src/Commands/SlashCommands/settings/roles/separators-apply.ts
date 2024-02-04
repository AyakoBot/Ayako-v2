import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 cmd.client.util.importCache.Events.BotEvents.guildEvents.guildMemberUpdate.separator.file.oneTimeRunner(
  cmd,
  cmd.guild,
 );
};
