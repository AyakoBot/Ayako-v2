import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.check;
 const type = args.shift() as 'warns' | 'bans' | 'mutes' | 'channelbans' | 'kicks';
 const userId = args.shift() as string;
 const page = Number(args.shift() as string);

 const allPunishments = await ch.getPunishment(userId, {
  includeTemp: true,
  identType: 'with-type',
  ident: type.replace('s', '') as 'warn' | 'ban' | 'mute' | 'channelban' | 'kick',
  guildid: cmd.guildId,
 });

 cmd.showModal({
  title: language.Page,
  custom_id: `check_${type}_${userId}_${page}`,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Short,
      custom_id: 'page',
      placeholder: language.Page,
      label: lan.pageBetween(1, Math.ceil(Number(allPunishments?.length) / 25)),
      value: String(page),
     },
    ],
   },
  ],
 });
};
