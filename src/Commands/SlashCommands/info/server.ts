import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const enteredID = cmd.options.get('server-id', false)?.value as string | null;
 const enteredName = cmd.options.get('server-name', false)?.value as string | null;
 const enteredInvite = cmd.options.get('server-invite', false)?.value as string | null;
 const language = await ch.languageSelector(cmd.guildId);
 const inviteArgs = enteredInvite?.split(/\/+/g) ?? [];
 const invite = inviteArgs.length
  ? await client.fetchInvite(inviteArgs.at(-1) as string, {}).catch(() => undefined)
  : undefined;
 const isInviteGuild = invite?.guild ? !('members' in invite.guild) : false;

 let serverID: string | null = null;
 if (!enteredID && !enteredName && !enteredInvite) serverID = cmd.guildId;
 if (enteredID) serverID = enteredID;
 if (enteredName) serverID = enteredName;
 if (enteredInvite) {
  if (!invite) {
   ch.errorCmd(cmd, language.errors.inviteNotFound, language);
   return;
  }

  if (!invite.guild) {
   ch.errorCmd(cmd, language.errors.inviteNotFound, language);
   return;
  }

  serverID = invite.guild.id;
  ch.cache.inviteGuilds.set(serverID, invite.guild as Discord.InviteGuild);
 }

 if (!serverID || (serverID && serverID.replace(/\D+/g, '').length !== serverID.length)) {
  ch.errorCmd(cmd, language.errors.serverNotFound, language);
  return;
 }

 const embeds = (await getEmbed(serverID))?.flat();

 if (!embeds) {
  ch.errorCmd(cmd, language.errors.serverNotFound, language);
  return;
 }

 ch.replyCmd(cmd, {
  embeds,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: language.featuresName,
      style: Discord.ButtonStyle.Secondary,
      custom_id: `info/features_${isInviteGuild ? invite?.code : serverID}_${isInviteGuild}`,
     },
    ],
   },
  ],
 });
};

const getEmbed = async (serverID: string): Promise<Discord.APIEmbed[] | undefined> =>
 client.shard?.broadcastEval(
  async (c, { id }) => {
   const chEval: typeof ch = await import(`${process.cwd()}/BaseClient/ClientHelper.js`);
   const g = c.guilds.cache.get(id) ?? chEval.cache.inviteGuilds.get(id);
   if (!g) return undefined;

   const language = await chEval.languageSelector(g.id);
   const lan = language.slashCommands.info.server;
   const eventLan = language.events.logs.guild;
   let owner: Discord.GuildMember | undefined;
   const isInviteGuild = !('members' in g);

   if (!isInviteGuild) {
    await chEval.request.guilds.getAutoModerationRules(g);
    await chEval.request.guilds.getVanityURL(g);

    owner = await chEval.request.guilds
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
     color: chEval.colorSelector(isInviteGuild ? undefined : await chEval.getBotMemberFromGuild(g)),
     fields: [
      {
       name: language.slashCommands.info.basic,
       value: [
        {
         name: chEval.util.makeBold(language.name),
         value: `\`${g.name}\`\n`,
        },
        {
         name: chEval.util.makeBold(lan.info.acronym),
         value: `\`${g.nameAcronym}\`\n`,
        },
        {
         name: chEval.util.makeBold('ID'),
         value: `\`${g.id}\`\n`,
        },
        {
         name: chEval.util.makeBold(eventLan.vanityUrlCode),
         value: g.vanityURLCode
          ? `[${g.vanityURLCode}](https://discord.gg/${g.vanityURLCode})\n`
          : `${language.None}\n`,
        },
        ...(isInviteGuild
         ? []
         : [
            {
             name: `${chEval.util.makeBold(lan.info.widgetChannel)}\n`,
             value: g.widgetChannel
              ? language.languageFunction.getChannel(g.widgetChannel)
              : `${language.None}\n`,
            },
            {
             name: `${chEval.util.makeBold(eventLan.afkChannelId)}\n`,
             value: language.languageFunction.getChannel(g.afkChannel),
            },
            {
             name: `${chEval.util.makeBold(eventLan.systemChannelId)}\n`,
             value: language.languageFunction.getChannel(g.systemChannel),
            },
            {
             name: `${chEval.util.makeBold(eventLan.rulesChannelId)}\n`,
             value: language.languageFunction.getChannel(g.rulesChannel),
            },
            {
             name: `${chEval.util.makeBold(eventLan.publicUpdatesChannelId)}\n`,
             value: language.languageFunction.getChannel(g.publicUpdatesChannel),
            },
            {
             name: chEval.util.makeBold(eventLan.afkTimeout),
             value: `\`${chEval.moment(g.afkTimeout * 1000, language)}\`\n` ?? `${language.None}\n`,
            },
           ]),
        {
         name: `${chEval.util.makeBold(eventLan.ownerId)}\n`,
         value: owner ? language.languageFunction.getUser(owner.user) : `${language.Unknown}\n`,
        },
        {
         name: chEval.util.makeBold(lan.info.description),
         value: g.description ? `\`\`\`${g.description}\`\`\`` : `${language.None}\n`,
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
         name: chEval.util.makeBold(language.createdAt),
         value: chEval.constants.standard.getTime(g.createdTimestamp),
        },
        ...(isInviteGuild
         ? []
         : [
            {
             name: chEval.util.makeBold(lan.stats.members),
             value: `\`${chEval.splitByThousand(g.memberCount)}\`/\`${chEval.splitByThousand(
              g.maximumMembers ?? 500000,
             )}\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.bots),
             value: `\`${chEval.splitByThousand(
              g.members.cache.filter((m) => !!m.user.bot).size,
             )}\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.channels),
             value: `\`${chEval.splitByThousand(g.channels.cache.size)}\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.roles),
             value: `\`${chEval.splitByThousand(g.roles.cache.size)}\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.emojis),
             value: `\`${chEval.splitByThousand(g.emojis.cache.size)}\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.autoModRules),
             value: `\`${chEval.splitByThousand(g.autoModerationRules.cache.size)}\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.invites),
             value: `\`${chEval.splitByThousand(g.invites.cache.size)}\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.vanityUses),
             value: `\`${chEval.splitByThousand(g.vanityURLUses ?? 0)}\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.stickers),
             value: `\`${chEval.splitByThousand(g.stickers.cache.size)}\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.boosters),
             value: `\`${chEval.splitByThousand(g.premiumSubscriptionCount ?? 0)}\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.level),
             value: `\`${chEval.splitByThousand(g.premiumTier ?? 0)}\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.maximumBitrate),
             value: `\`${g.maximumBitrate / 1000}kbps\``,
            },
            {
             name: chEval.util.makeBold(lan.stats.maxStageVideoChannelUsers),
             value: `\`${chEval.splitByThousand(g.maxStageVideoChannelUsers ?? 0)}\``,
            },
            {
             name: chEval.util.makeBold(language.large),
             value: `${chEval.settingsHelpers.embedParsers.boolean(g.large, language)}`,
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
             name: chEval.util.makeBold(eventLan.defaultMessageNotificationsName),
             value: `\`${eventLan.defaultMessageNotifications[g.defaultMessageNotifications]}\``,
            },
            {
             name: chEval.util.makeBold(eventLan.explicitContentFilterName),
             value: `\`${eventLan.explicitContentFilter[g.explicitContentFilter]}\``,
            },
            {
             name: chEval.util.makeBold(eventLan.mfaLevelName),
             value: `\`${eventLan.mfaLevel[g.mfaLevel]}\``,
            },
            {
             name: chEval.util.makeBold(language.regionsName),
             value: `\`${language.regions[g.preferredLocale as keyof typeof language.regions]}\``,
            },
           ]),
        {
         name: chEval.util.makeBold(eventLan.nsfwLevelName),
         value: `\`${eventLan.nsfwLevel[g.nsfwLevel]}\``,
        },
        {
         name: chEval.util.makeBold(eventLan.verificationLevelName),
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
   context: { id: serverID },
  },
 ) as Promise<Discord.APIEmbed[] | undefined>;
