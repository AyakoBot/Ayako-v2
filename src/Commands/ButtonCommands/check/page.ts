import * as Discord from 'discord.js';
import { getPayload } from '../../SlashCommands/check.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'warns' | 'bans' | 'mutes' | 'channelbans' | 'kicks';
 const user = await ch.getUser(args.shift() as string);
 const language = await ch.getLanguage(cmd.guildId);

 if (!user) {
  ch.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const member = await ch.request.guilds.getMember(cmd.guild, cmd.user.id);
 const pageType = args.shift() as 'forth' | 'back';
 const page = Number(args.shift() as string);

 const payload = await getPayload(
  {
   user,
   language,
   guild: cmd.guild,
   member: 'message' in member ? undefined : member,
  },
  {
   type,
   page: pageType === 'forth' ? page + 1 : page - 1,
   values: [],
  },
 );

 cmd.update(payload as Discord.InteractionUpdateOptions);
};
