import * as Discord from 'discord.js';
import run from '../../../SlashCommands/roles/builders/button-roles.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const reply = await cmd.deferReply({ ephemeral: true });

 run(cmd, [], reply);
};
