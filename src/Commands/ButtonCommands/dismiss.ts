import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction<'cached'>) => {
 await cmd.deferUpdate();
 cmd.deleteReply();
};
