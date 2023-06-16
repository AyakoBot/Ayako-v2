import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as DBT from '../../../Typings/DataBaseTypings.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;
 if (!cmd.guild) return;

 const giveaways = await ch.query(`SELECT * FROM giveaways WHERE guildid = $1;`, [cmd.guildId], {
  returnType: 'giveaways',
  asArray: true,
 });

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.giveaway.list;

 const embed: Discord.APIEmbed = {
  description: giveaways?.length ? undefined : lan.noGiveaways,
  fields: giveaways?.map((g) => ({
   name: g.description.slice(0, 256),
   value: [
    {
     name: language.slashCommands.giveaway.end.ended,
     value: g.ended ? ch.stringEmotes.tickWithBackground : ch.stringEmotes.crossWithBackground,
    },
    {
     name: language.slashCommands.giveaway.list.end,
     value: ch.constants.standard.getTime(Number(g.endtime)),
    },
    {
     name: language.slashCommands.giveaway.create.participants,
     value: ch.util.makeInlineCode(String(g.participants?.length || 0)),
    },
    {
     name: language.slashCommands.giveaway.list.winnercount,
     value: ch.util.makeInlineCode(String(g.winnercount)),
    },
    {
     name: language.slashCommands.giveaway.list.claimingdone,
     value: getClaimingDone(g, language),
    },
    {
     name: 'URL',
     value: ch.constants.standard.msgurl(g.guildid, g.channelid, g.msgid),
    },
    {
     name: language.slashCommands.giveaway.list.host,
     value: `<@${g.host}>`,
    },
    {
     name: language.slashCommands.giveaway.list.reqrole,
     value: g.reqrole ? `<@&${g.reqrole}>` : language.None,
    },
    g.collecttime
     ? {
        name: language.slashCommands.giveaway.list.collecttime,
        value: ch.constants.standard.getTime(Number(g.collecttime)),
       }
     : undefined,
    {
     name: language.slashCommands.giveaway.list.failreroll,
     value: g.failreroll ? ch.stringEmotes.tickWithBackground : ch.stringEmotes.crossWithBackground,
    },
   ]
    .filter((v): v is { name: string; value: string } => !!v)
    .map(({ name, value }) => `${name}: ${value}`)
    .join('\n'),
  })),
 };

 ch.replyCmd(cmd, { embeds: [embed] });
};

const getClaimingDone = (g: DBT.giveaways, language: CT.Language) => {
 if (!g.collecttime || !g.actualprize) return language.slashCommands.giveaway.list.notEnabled;

 if (!g.claimingdone) return ch.stringEmotes.crossWithBackground;
 return ch.stringEmotes.tickWithBackground;
};
