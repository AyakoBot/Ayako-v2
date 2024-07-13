import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 const enteredId = cmd.options.get('server-id', false)?.value as string | null;
 const enteredName = cmd.options.get('server-name', false)?.value as string | null;
 const enteredInvite = cmd.options.get('server-invite', false)?.value as string | null;
 const language = await client.util.getLanguage(cmd.guildId);
 const inviteArgs = enteredInvite?.split(/\/+/g) ?? [];
 const invite = inviteArgs.length
  ? await client.util.request.invites
     .get(cmd.guild, inviteArgs.at(-1) as string, {}, cmd.client)
     .catch(() => undefined)
  : undefined;
 const isInviteGuild =
  invite && 'guild' in invite && invite.guild ? !('members' in invite.guild) : false;

 let serverId: string | null = null;
 if (!enteredId && !enteredName && !enteredInvite) serverId = cmd.guildId;
 if (enteredId) serverId = enteredId;
 if (enteredName) serverId = enteredName;
 if (enteredInvite) {
  if (!invite) {
   client.util.errorCmd(cmd, language.errors.inviteNotFound, language);
   return;
  }

  if (!('guild' in invite) || !invite.guild) {
   client.util.errorCmd(cmd, language.errors.inviteNotFound, language);
   return;
  }

  serverId = invite.guild.id;
  client.util.cache.inviteGuilds.set(serverId, invite.guild as Discord.InviteGuild);
 }

 if (!serverId || (serverId && serverId.replace(/\D+/g, '').length !== serverId.length)) {
  client.util.errorCmd(cmd, language.errors.serverNotFound, language);
  return;
 }

 const embeds = (await getEmbed(serverId))?.flat().filter((e) => !!e);

 if (!embeds?.length) {
  client.util.errorCmd(cmd, language.errors.serverNotFound, language);
  return;
 }

 client.util.replyCmd(cmd, {
  embeds,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: language.t.featuresName,
      style: Discord.ButtonStyle.Secondary,
      custom_id: `info/features_${isInviteGuild ? invite?.code : serverId}_${isInviteGuild}`,
     },
     {
      type: Discord.ComponentType.Button,
      label: language.t.Roles,
      style: Discord.ButtonStyle.Secondary,
      disabled: isInviteGuild,
      custom_id: `info/roles_server_${isInviteGuild ? invite?.code : serverId}`,
     },
    ],
   },
  ],
 });
};

const getEmbed = async (serverId: string): Promise<Discord.APIEmbed[] | undefined> =>
 client.cluster?.broadcastEval(
  async (c, { id }) => {
   const g = c.guilds?.cache.get(id) ?? c.util?.cache.inviteGuilds.get(id);
   if (!g) return undefined;

   const language = await c.util.getLanguage(g.id);
   const lan = language.slashCommands.info.server;
   const eventLan = language.events.logs.guild;
   let owner: Discord.GuildMember | undefined;
   const isInviteGuild = !('members' in g);

   if (!isInviteGuild) {
    await c.util.request.guilds.getAutoModerationRules(g);
    await c.util.request.guilds.getVanityURL(g);

    owner = await c.util.request.guilds
     .getMember(g, g.ownerId)
     .then((u) => ('message' in u ? undefined : u));
   }

   return [
    {
     thumbnail: {
      url: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.${
       g.icon?.startsWith('a_') ? 'gif' : 'png'
      }?size=4096`,
     },
     author: {
      name: lan.author,
     },
     image: {
      url: `https://cdn.discordapp.com/banners/${g.id}/${g.banner}.${
       g.banner?.startsWith('a_') ? 'gif' : 'png'
      }?size=4096`,
     },
     color: c.util.getColor(isInviteGuild ? undefined : await c.util.getBotMemberFromGuild(g)),
     fields: [
      {
       name: language.slashCommands.info.basic,
       value: [
        {
         name: c.util.util.makeBold(language.t.name),
         value: `\`${g.name}\`\n`,
        },
        {
         name: c.util.util.makeBold(lan.info.acronym),
         value: `\`${g.nameAcronym}\`\n`,
        },
        {
         name: c.util.util.makeBold('ID'),
         value: `\`${g.id}\`\n`,
        },
        {
         name: c.util.util.makeBold(eventLan.vanityUrlCode),
         value: g.vanityURLCode
          ? `[${g.vanityURLCode}](https://discord.gg/${g.vanityURLCode})\n`
          : `${language.t.None}\n`,
        },
        ...(isInviteGuild
         ? []
         : [
            {
             name: `${c.util.util.makeBold(lan.info.widgetChannel)}\n`,
             value: g.widgetChannel
              ? language.languageFunction.getChannel(g.widgetChannel)
              : `${language.t.None}\n`,
            },
            {
             name: `${c.util.util.makeBold(eventLan.afkChannelId)}\n`,
             value: language.languageFunction.getChannel(g.afkChannel),
            },
            {
             name: `${c.util.util.makeBold(eventLan.systemChannelId)}\n`,
             value: language.languageFunction.getChannel(g.systemChannel),
            },
            {
             name: `${c.util.util.makeBold(eventLan.rulesChannelId)}\n`,
             value: language.languageFunction.getChannel(g.rulesChannel),
            },
            {
             name: `${c.util.util.makeBold(eventLan.publicUpdatesChannelId)}\n`,
             value: language.languageFunction.getChannel(g.publicUpdatesChannel),
            },
            {
             name: c.util.util.makeBold(eventLan.afkTimeout),
             value:
              `\`${c.util.moment(g.afkTimeout * 1000, language)}\`\n` ?? `${language.t.None}\n`,
            },
           ]),
        {
         name: `${c.util.util.makeBold(eventLan.ownerId)}\n`,
         value: owner ? language.languageFunction.getUser(owner.user) : `${language.t.Unknown}\n`,
        },
        {
         name: c.util.util.makeBold(lan.info.description),
         value: g.description ? `\`\`\`${g.description}\`\`\`` : `${language.t.None}\n`,
        },
       ]
        .map(({ name, value }) => `${name} ${value}`)
        .join(''),
       inline: false,
      },
      {
       name: language.slashCommands.info.stats,
       value: [
        {
         name: c.util.util.makeBold(language.t.createdAt),
         value: c.util.constants.standard.getTime(g.createdTimestamp),
        },
        ...(isInviteGuild
         ? []
         : [
            {
             name: c.util.util.makeBold(lan.stats.members),
             value: `\`${c.util.splitByThousand(g.memberCount)}\`/\`${c.util.splitByThousand(
              g.maximumMembers ?? 500000,
             )}\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.bots),
             value: `\`${c.util.splitByThousand(
              g.members.cache.filter((m) => !!m.user.bot).size,
             )}\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.channels),
             value: `\`${c.util.splitByThousand(g.channels.cache.size)}\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.roles),
             value: `\`${c.util.splitByThousand(g.roles.cache.size)}\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.emojis),
             value: `\`${c.util.splitByThousand(g.emojis.cache.size)}\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.autoModRules),
             value: `\`${c.util.splitByThousand(g.autoModerationRules.cache.size)}\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.invites),
             value: `\`${c.util.splitByThousand(g.invites.cache.size)}\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.vanityUses),
             value: `\`${c.util.splitByThousand(g.vanityURLUses ?? 0)}\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.stickers),
             value: `\`${c.util.splitByThousand(g.stickers.cache.size)}\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.boosters),
             value: `\`${c.util.splitByThousand(g.premiumSubscriptionCount ?? 0)}\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.level),
             value: `\`${c.util.splitByThousand(g.premiumTier ?? 0)}\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.maximumBitrate),
             value: `\`${g.maximumBitrate / 1000}kbps\``,
            },
            {
             name: c.util.util.makeBold(lan.stats.maxStageVideoChannelUsers),
             value: `\`${c.util.splitByThousand(g.maxStageVideoChannelUsers ?? 0)}\``,
            },
            {
             name: c.util.util.makeBold(language.t.large),
             value: `${c.util.settingsHelpers.embedParsers.boolean(g.large, language)}`,
            },
           ]),
       ]
        .map(({ name, value }) => `${name} ${value}`)
        .join('\n'),
       inline: false,
      },
      {
       name: language.slashCommands.info.otherInfo,
       value: [
        ...(isInviteGuild
         ? []
         : [
            {
             name: c.util.util.makeBold(eventLan.defaultMessageNotificationsName),
             value: `\`${eventLan.defaultMessageNotifications[g.defaultMessageNotifications]}\``,
            },
            {
             name: c.util.util.makeBold(eventLan.explicitContentFilterName),
             value: `\`${eventLan.explicitContentFilter[g.explicitContentFilter]}\``,
            },
            {
             name: c.util.util.makeBold(eventLan.mfaLevelName),
             value: `\`${eventLan.mfaLevel[g.mfaLevel]}\``,
            },
            {
             name: c.util.util.makeBold(language.t.regionsName),
             value: `\`${language.regions[g.preferredLocale as keyof typeof language.regions]}\``,
            },
           ]),
        {
         name: c.util.util.makeBold(eventLan.nsfwLevelName),
         value: `\`${eventLan.nsfwLevel[g.nsfwLevel]}\``,
        },
        {
         name: c.util.util.makeBold(eventLan.verificationLevelName),
         value: `\`${eventLan.verificationLevel[g.verificationLevel]}\``,
        },
       ]
        .map(({ name, value }) => `${name} ${value}`)
        .join('\n'),
       inline: false,
      },
     ],
     footer: {
      text: isInviteGuild ? lan.inviteGuild : undefined,
     },
    },
   ];
  },
  {
   context: { id: serverId },
  },
 ) as Promise<Discord.APIEmbed[] | undefined>;
