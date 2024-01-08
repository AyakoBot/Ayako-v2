import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import * as CT from '../../../Typings/Typings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.ButtonInteraction<'cached'>,
 page = 0,
) => {
 if (!cmd.inCachedGuild()) return;

 const giveaways = await client.util.DataBase.giveaways.findMany({
  where: { guildid: cmd.guildId },
  orderBy: {
   msgid: 'desc',
  },
 });

 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.list;

 const embed: Discord.APIEmbed = {
  description: giveaways?.length ? undefined : lan.noGiveaways,
  fields: giveaways?.map((g) => ({
   name: g.description.slice(0, 256),
   value: [
    {
     name: language.slashCommands.giveaway.end.ended,
     value: g.ended
      ? client.util.emotes.tickWithBackground
      : client.util.emotes.crossWithBackground,
    },
    {
     name: language.slashCommands.giveaway.list.end,
     value: client.util.constants.standard.getTime(Number(g.endtime)),
    },
    {
     name: language.slashCommands.giveaway.create.participants,
     value: client.util.util.makeInlineCode(String(g.participants?.length || 0)),
    },
    {
     name: language.slashCommands.giveaway.list.winnercount,
     value: client.util.util.makeInlineCode(String(g.winnercount)),
    },
    {
     name: language.slashCommands.giveaway.list.claimingdone,
     value: getClaimingDone(g, language),
    },
    {
     name: 'URL',
     value: client.util.constants.standard.msgurl(g.guildid, g.channelid, g.msgid),
    },
    {
     name: language.slashCommands.giveaway.list.host,
     value: `<@${g.host}>`,
    },
    {
     name: language.slashCommands.giveaway.list.reqrole,
     value: g.reqrole ? `<@&${g.reqrole}>` : language.t.None,
    },
    g.collecttime
     ? {
        name: language.slashCommands.giveaway.list.collecttime,
        value: client.util.util.makeInlineCode(client.util.moment(Number(g.collecttime), language)),
       }
     : undefined,
    {
     name: language.slashCommands.giveaway.list.failreroll,
     value: g.failreroll
      ? client.util.emotes.tickWithBackground
      : client.util.emotes.crossWithBackground,
    },
   ]
    .filter((v): v is { name: string; value: string } => !!v)
    .map(({ name, value }) => `${name}: ${value}`)
    .join('\n'),
  })),
 };

 client.util.replyCmd(cmd, {
  embeds: [embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: getButtons(page, giveaways ?? []),
   },
  ],
 });
};

const getClaimingDone = (g: Prisma.giveaways, language: CT.Language) => {
 if (!g.collecttime || !g.actualprize) return language.slashCommands.giveaway.list.notEnabled;
 if (!g.claimingdone) return client.util.emotes.crossWithBackground;
 return client.util.emotes.tickWithBackground;
};

const getButtons = (page: number, giveaways: Prisma.giveaways[]): Discord.APIButtonComponent[] => [
 {
  type: Discord.ComponentType.Button,
  emoji: client.util.emotes.back,
  style: Discord.ButtonStyle.Primary,
  custom_id: `giveaway/list_${page - 1}`,
  disabled: page === 0,
 },
 {
  type: Discord.ComponentType.Button,
  emoji: client.util.emotes.forth,
  style: Discord.ButtonStyle.Primary,
  custom_id: `giveaway/list_${page + 1}`,
  disabled: Math.ceil(giveaways.length / 25) - 1 === page,
 },
];
