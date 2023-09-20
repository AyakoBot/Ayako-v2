import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction<'cached'>) => {
 const user = cmd.options.getUser('user', true);

 const blocked = await ch.DataBase.blockedusers.upsert({
  where: { userid_blockeduserid: { userid: cmd.user.id, blockeduserid: user.id } },
  create: {
   userid: cmd.user.id,
   blockeduserid: user.id,
   blockedcmd: [],
  },
  update: {},
  select: { blockedcmd: true },
 });

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.rp;
 const commands = ch.constants.commands.interactions.filter((c) => !c.aliasOf);
 const options = ch.getChunks(
  commands.map((c) => ({
   label: c.name,
   value: c.name,
   description: ch.constants.commands.interactions
    .filter((c2) => c2.aliasOf === c.name)
    .map((c2) => c2.name)
    .join(', '),
  })),
  25,
 );

 ch.replyCmd(cmd, {
  content: lan.blocked(user),
  embeds: [
   {
    description: `${lan.blockedCmds} ${(blocked.blockedcmd?.length
     ? blocked.blockedcmd
     : commands.map((c) => c.name)
    )
     .map((c) => ch.util.makeInlineCode(c))
     .join(', ')}\n\n${lan.availableCmds} ${
     blocked.blockedcmd?.length
      ? commands
         .filter((c) => !blocked.blockedcmd?.includes(c.name))
         .map((c) => ch.util.makeInlineCode(c.name))
         .join(', ')
      : language.None
    }`,
   },
  ],
  components: options.map((opts, i) => ({
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.StringSelect,
     customId: `rp/block_${i}`,
     placeholder: lan.blockPlaceholder,
     options: opts,
    },
   ],
  })),
 });
};
