import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);

 cmd.showModal({
  title: language.verification.verify,
  custom_id: `verify_${args.shift()}`,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Short,
      label: language.verification.enterCode,
      custom_id: '-',
      max_length: 4,
      min_length: 4,
     },
    ],
   },
  ],
 });
};
