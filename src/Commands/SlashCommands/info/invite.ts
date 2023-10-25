import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.info.invite;
 const eventLan = language.events.logs.invite;
 const inviteCodeOrLink = cmd.options.getString('invite', true);

 const isUrl =
  inviteCodeOrLink.includes('discord.gg') || inviteCodeOrLink.includes('discordapp.com/invite/');
 const inviteCode = isUrl
  ? new URL(
     inviteCodeOrLink.replace(/^[^http]/gm, 'https://d').replace('http://', 'https://'),
    ).pathname?.replace('/', '')
  : inviteCodeOrLink;

 if (!inviteCode) {
  ch.replyCmd(cmd, { content: lan.invalidInvite });
  return;
 }

 const invite =
  (
   (await cmd.client.shard?.broadcastEval(
    (cl, { i }) => cl.guilds.cache.find((g) => g.invites.cache.has(i))?.invites.cache.get(i),
    { context: { i: inviteCode } },
   )) as Discord.Invite[]
  ).find((i): i is Discord.Invite => !!i) ??
  (await cmd.client.fetchInvite(inviteCode).catch(() => undefined));

 if (!invite) {
  ch.replyCmd(cmd, { content: lan.invalidInvite });
  return;
 }

 const inviter = invite.inviterId ? await ch.getUser(invite.inviterId) : undefined;

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  color: ch.getColor(await ch.getBotMemberFromGuild(cmd.guild)),
  description: [
   {
    name: lan.code,
    value: `https://discord.gg/${invite.code} / ${ch.util.makeInlineCode(invite.code)}`,
   },
   invite.createdTimestamp
    ? {
       name: language.createdAt,
       value: `${ch.constants.standard.getTime(invite.createdTimestamp)}`,
      }
    : undefined,
   invite.channel || invite.channelId
    ? {
       name: language.Channel,
       value: invite.channel
        ? language.languageFunction.getChannel(
           invite.channel,
           language.channelTypes[invite.channel.type],
          )
        : `<#${invite.channelId}> / ${ch.util.makeInlineCode(invite.channelId as string)}`,
      }
    : undefined,
   invite.guild
    ? {
       name: language.Server,
       value: language.languageFunction.getGuild(invite.guild),
      }
    : undefined,
   inviter
    ? {
       name: eventLan.inviter,
       value: language.languageFunction.getUser(inviter),
      }
    : undefined,
   invite.maxAge && invite.createdTimestamp
    ? {
       name: eventLan.expiresAt,
       value:
        invite.maxAge === 0
         ? language.Never
         : ch.constants.standard.getTime(invite.maxAge * 1000 + invite.createdTimestamp),
      }
    : undefined,
   invite.maxAge
    ? {
       name: eventLan.maxAge,
       value: invite.maxAge === 0 ? '∞' : ch.moment(invite.maxAge * 1000, language),
      }
    : undefined,
   invite.maxUses
    ? {
       name: eventLan.maxUses,
       value: invite.maxUses === 0 ? '∞' : invite.maxUses.toString(),
      }
    : undefined,
   invite.temporary !== null
    ? {
       name: eventLan.temporary,
       value: invite.temporary ? language.Yes : language.No,
      }
    : undefined,
   invite.uses
    ? {
       name: lan.uses,
       value: ch.util.makeInlineCode(String(invite.uses)),
      }
    : undefined,
  ]
   .filter((v): v is { name: string; value: string } => !!v)
   .map((v) => `${ch.util.makeBold(`${v.name}:`)} ${v.value.replace('\n', '')}`)
   .join('\n'),
 };

 ch.replyCmd(cmd, { embeds: [embed] });
};
