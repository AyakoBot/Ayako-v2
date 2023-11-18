import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const type = args.shift() as 'warns' | 'bans' | 'mutes' | 'channelbans' | 'kicks';
 const userId = args.shift() as string;
 const page = Number(args.shift() as string);
 const maxPages = Number(args.shift() as string);

 cmd.showModal({
  title: language.t.Page,
  custom_id: `check_${type}_${userId}_${page}`,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Short,
      custom_id: 'page',
      placeholder: language.t.Page,
      label: language.t.pageBetween(1, maxPages),
      value: String(page),
     },
    ],
   },
  ],
 });
};
