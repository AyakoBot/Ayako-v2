import * as Discord from 'discord.js';
import { getPayload } from '../../SlashCommands/mod/check.js';
import { PunishmentType } from 'src/Typings/Typings.js';

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const user = await cmd.client.util.getUser(args.shift() as string);
 const language = await cmd.client.util.getLanguage(cmd.guildId);

 if (!user) {
  cmd.client.util.errorCmd(cmd, language.errors.userNotFound, language);
  return;
 }

 const page = args.shift();
 const type = args.shift() as PunishmentType.Warn | PunishmentType.Kick | PunishmentType.Mute | PunishmentType.Ban | PunishmentType.Channelban;
 const member = await cmd.client.util.request.guilds.getMember(cmd.guild, cmd.user.id);

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
