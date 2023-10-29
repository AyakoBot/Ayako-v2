import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { getPayload } from '../../SlashCommands/check.js';

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const user = await ch.getUser(args.shift() as string);
 const language = await ch.getLanguage(cmd.guildId);

 if (!user) {
  ch.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const page = args.shift();
 const type = args.shift() as 'warns' | 'bans' | 'mutes' | 'channelbans' | 'kicks';
 const member = await ch.request.guilds.getMember(cmd.guild, cmd.user.id);

 const payload = await getPayload(
  {
   language,
   user,
   guild: cmd.guild,
   member: 'message' in member ? undefined : member,
  },
  {
   type,
   page: Number(page),
   values: cmd.values.map((v) => Number(v)),
  },
 );

 cmd.update(payload as Discord.InteractionUpdateOptions);
};
