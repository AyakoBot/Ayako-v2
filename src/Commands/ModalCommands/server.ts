import * as Discord from 'discord.js';
import list from '../SlashCommands/server/list.js';

export default async (cmd: Discord.ModalSubmitInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 list(cmd, [], Number(cmd.fields.getTextInputValue('page')));
};
