import * as Discord from 'discord.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 if (!cmd.inCachedGuild()) return;

 cmd.client.util.importCache.Commands.SlashCommands['self-roles'].file.default(cmd, cmd.values);
};
