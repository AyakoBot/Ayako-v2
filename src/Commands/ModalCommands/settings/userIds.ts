import type * as Discord from 'discord.js';
import users from '../../SelectCommands/UserSelect/settings/users.js';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.isFromMessage()) return;

 const fieldName = cmd.components[0].components[0].customId;
 args.unshift(fieldName);

 users(cmd, args);
};
