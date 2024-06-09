import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction<'cached'>) => {
 if (!cmd.inCachedGuild()) return;
 const user = cmd.options.getUser('user', false);

 const blocked = await cmd.client.util.DataBase.blockedusers.upsert({
  where: { userid_blockeduserid: { userid: cmd.user.id, blockeduserid: user?.id ?? '0' } },
  create: {
   userid: cmd.user.id,
   blockeduserid: user?.id ?? '0',
   blockedcmd: [],
  },
  update: {},
  select: { blockedcmd: true },
 });

 respond(cmd, user, blocked);
};

export const respond = async (
 cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.StringSelectMenuInteraction<'cached'>,
 user: Discord.User | null,
 blocked: { blockedcmd?: string[] },
 lang?: CT.Language,
) => {
 const language = lang ?? (await cmd.client.util.getLanguage(cmd.guildId));
 const lan = language.slashCommands.rp;
 const commands = cmd.client.util.constants.commands.interactions
  .filter((c) => c.users)
  .filter((c) => !c.aliasOf);

 const options = cmd.client.util.getChunks(
  commands.map((c) => ({
   label: c.name,
   value: c.name,
   emoji: blocked.blockedcmd?.includes(c.name)
    ? cmd.client.util.emotes.minusBG
    : cmd.client.util.emotes.plusBG,
   description:
    cmd.client.util.constants.commands.interactions
     .filter((c2) => c2.aliasOf === c.name)
     .map((c2) => c2.name)
     .join(', ') || undefined,
  })),
  25,
 );

 const payload = {
  content: user ? lan.blocked(user) : lan.globalBlocked,
  embeds: [
   {
    description: `${lan.blockedCmds} ${(blocked.blockedcmd?.length || !user
     ? blocked.blockedcmd ?? []
     : commands.map((c) => c.name)
    )
     .map((c) => cmd.client.util.util.makeInlineCode(c))
     .join(', ')}\n\n${lan.availableCmds} ${
     blocked.blockedcmd?.length
      ? commands
         .filter((c) => !blocked.blockedcmd?.includes(c.name))
         .map((c) => cmd.client.util.util.makeInlineCode(c.name))
         .join(', ')
      : user
        ? ''
        : commands
           .filter((c) => !blocked.blockedcmd?.includes(c.name))
           .map((c) => cmd.client.util.util.makeInlineCode(c.name))
           .join(', ')
    }`,
    url: `https://ayakobot.com?user=${user?.id ?? '0'}`,
   },
  ],
  components: [
   ...options.map((opts, i) => ({
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.StringSelect,
      customId: `rp/block_${i}`,
      placeholder: lan.blockPlaceholder,
      options: opts,
      max_values: opts.length,
      min_values: 1,
     },
    ],
   })),
   ...(user
    ? [
       {
        type: Discord.ComponentType.ActionRow,
        components: [
         {
          type: Discord.ComponentType.Button,
          style: Discord.ButtonStyle.Danger,
          customId: 'rp/unblock',
          label: lan.unblock,
         },
        ],
       },
      ]
    : []),
  ],
 };

 if (cmd instanceof Discord.ChatInputCommandInteraction) {
  cmd.client.util.replyCmd(cmd, payload as Discord.InteractionReplyOptions);
  return;
 }

 cmd.update(payload as Discord.InteractionUpdateOptions);
};
