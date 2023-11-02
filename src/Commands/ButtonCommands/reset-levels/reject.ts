import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 cmd.deleteReply();
};
