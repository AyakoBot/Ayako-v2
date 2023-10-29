import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const page = Number(args.shift() as string);
 const maxPage = Number(args.shift() as string);

 cmd.showModal({
  title: language.Page,
  custom_id: `server`,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Short,
      custom_id: 'page',
      placeholder: language.Page,
      label: language.pageBetween(1, maxPage),
      value: String(page),
     },
    ],
   },
  ],
 });
};
