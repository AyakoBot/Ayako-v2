import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction<'cached'>) => {
 if (!cmd.inCachedGuild()) return;
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

 respond(cmd, user, blocked);
};

export const respond = async (
 cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.StringSelectMenuInteraction<'cached'>,
 user: Discord.User,
 blocked: { blockedcmd?: string[] },
 lang?: CT.Language,
) => {
 const language = lang ?? (await ch.getLanguage(cmd.guildId));
 const lan = language.slashCommands.rp;
 const commands = ch.constants.commands.interactions
  .filter((c) => c.users)
  .filter((c) => !c.aliasOf);

 const options = ch.getChunks(
  commands.map((c) => ({
   label: c.name,
   value: c.name,
   emoji: blocked.blockedcmd?.includes(c.name) ? ch.emotes.minusBG : ch.emotes.plusBG,
   description:
    ch.constants.commands.interactions
     .filter((c2) => c2.aliasOf === c.name)
     .map((c2) => c2.name)
     .join(', ') || undefined,
  })),
  25,
 );

 const payload = {
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
      : language.t.None
    }`,
    url: `https://ayakobot.com?user=${user.id}`,
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
  ],
 };

 if (cmd instanceof Discord.ChatInputCommandInteraction) {
  ch.replyCmd(cmd, payload as Discord.InteractionReplyOptions);
  return;
 }

 cmd.update(payload as Discord.InteractionUpdateOptions);
};
