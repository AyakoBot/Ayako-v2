import { getPayload } from '../../SlashCommands/info/user.js';
import { MessageFlags, type ButtonInteraction } from 'discord.js';

export default async (cmd: ButtonInteraction, args: string[]) => {
 const language = await cmd.client.util.getLanguage(cmd.locale);
 const user = (await cmd.client.util.getUser(args.pop() || cmd.user.id)) || cmd.user;

 const payload = await getPayload(user, language, cmd.guild || undefined);

 cmd.reply({ ...payload, flags: MessageFlags.Ephemeral });
};
