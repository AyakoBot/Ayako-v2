import type * as Discord from 'discord.js';
import user from '../../SelectCommands/UserSelect/settings/user.js';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.isFromMessage()) return;

 const fieldName = cmd.components[0].components[0].customId;
 args.unshift(fieldName);

 user(cmd, args);
};
