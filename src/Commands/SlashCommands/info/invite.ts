import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const language = await cmd.client.util.getLanguage(cmd.guildId);
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
  cmd.client.util.replyCmd(cmd, { content: lan.invalidInvite });
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
  cmd.client.util.replyCmd(cmd, { content: lan.invalidInvite });
  return;
 }

 const inviter = invite.inviterId ? await cmd.client.util.getUser(invite.inviterId) : undefined;

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  color: cmd.client.util.getColor(await cmd.client.util.getBotMemberFromGuild(cmd.guild)),
  description: [
   {
    name: lan.code,
    value: `https://discord.gg/${invite.code} / ${cmd.client.util.util.makeInlineCode(
     invite.code,
    )}`,
   },
   invite.createdTimestamp
    ? {
       name: language.t.createdAt,
       value: `${cmd.client.util.constants.standard.getTime(invite.createdTimestamp)}`,
      }
    : undefined,
   invite.channel || invite.channelId
    ? {
       name: language.t.Channel,
       value: invite.channel
        ? language.languageFunction.getChannel(
           invite.channel,
           language.channelTypes[invite.channel.type],
          )
        : `<#${invite.channelId}> / ${cmd.client.util.util.makeInlineCode(
           invite.channelId as string,
          )}`,
      }
    : undefined,
   invite.guild
    ? {
       name: language.t.Server,
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
         ? language.t.Never
         : cmd.client.util.constants.standard.getTime(
            invite.maxAge * 1000 + invite.createdTimestamp,
           ),
      }
    : undefined,
   invite.maxAge
    ? {
       name: eventLan.maxAge,
       value: invite.maxAge === 0 ? '∞' : cmd.client.util.moment(invite.maxAge * 1000, language),
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
       value: invite.temporary ? language.t.Yes : language.t.No,
      }
    : undefined,
   invite.uses
    ? {
       name: lan.uses,
       value: cmd.client.util.util.makeInlineCode(String(invite.uses)),
      }
    : undefined,
  ]
   .filter((v): v is { name: string; value: string } => !!v)
   .map((v) => `${cmd.client.util.util.makeBold(`${v.name}:`)} ${v.value.replace('\n', '')}`)
   .join('\n'),
 };

 cmd.client.util.replyCmd(cmd, { embeds: [embed] });
};
