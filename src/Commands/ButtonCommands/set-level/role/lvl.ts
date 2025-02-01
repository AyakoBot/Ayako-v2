import * as Discord from 'discord.js';

export default async (
 cmd: Discord.ButtonInteraction,
 args: string[],
 type: 'lvl' | 'xp' = 'lvl',
 roleOrUser: 'role' | 'user' = 'role',
) => {
 if (!cmd.inCachedGuild()) return;

 const id = args.shift() as string;
 const language = await cmd.client.util.getLanguage(cmd.guildId);

 cmd.showModal({
  title: language.slashCommands.setLevel[type === 'lvl' ? 'newLvl' : 'newXP'],
  customId: `set-level/${type}_${id}_${roleOrUser}`,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Short,
      customId: 'new',
      label: language.slashCommands.setLevel[type === 'lvl' ? 'newLvl' : 'newXP'],
      placeholder: language.t.Number,
     },
    ],
   },
  ],
 });
};
