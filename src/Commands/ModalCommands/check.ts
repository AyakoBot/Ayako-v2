import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import { getPayload } from '../SlashCommands/mod/check.js';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 const type = args.shift() as 'warns' | 'bans' | 'mutes' | 'channelbans' | 'kicks';
 const user = await ch.getUser(args.shift() as string);
 const language = await ch.getLanguage(cmd.guildId);

 if (!user) {
  ch.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const member = await ch.request.guilds.getMember(cmd.guild, cmd.user.id);
 const page = cmd.fields.getTextInputValue('page');

 const payload = await getPayload(
  {
   user,
   language,
   guild: cmd.guild,
   member: 'message' in member ? undefined : member,
  },
  {
   type,
   page: Number(page),
   values: [],
  },
 );

 cmd.update(payload as Discord.InteractionUpdateOptions);
};
