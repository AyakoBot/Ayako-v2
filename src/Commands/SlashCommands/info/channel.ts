import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const channel = cmd.options.getChannel('channel', true);
 const language = await ch.getLanguage(cmd.guildId);

 if (!channel) {
  ch.errorCmd(cmd, language.t.errors.channelNotFound, language);
  return;
 }

 const embeds = (await getEmbed(channel.id, cmd.guildId, cmd.user.id))?.flat();

 if (!embeds) {
  ch.errorCmd(cmd, language.t.errors.channelNotFound, language);
  return;
 }

 ch.replyCmd(cmd, {
  embeds,
 });
};

const getEmbed = async (
 channelID: string,
 guildID: string,
 userID: string,
): Promise<Discord.APIEmbed[] | undefined> =>
 client.shard?.broadcastEval(
  async (cl, { id, gid, mid, ViewChannel }) => {
   const chEval: typeof ch = await import(`${process.cwd()}/BaseClient/ClientHelper.js`);
   const g = cl.guilds.cache.get(gid);
   if (!g) return undefined;

   const rawMember = await chEval.request.guilds.getMember(g, mid);
   const member = 'message' in rawMember ? undefined : rawMember;

   const c = cl.channels.cache.get(id) as Discord.GuildBasedChannel;
   if (!c) return undefined;

   const language = await chEval.getLanguage(gid);
   const lan = language.slashCommands.info.channel;
   const eventLan = language.events.logs.channel;
   const scheduledEventLan = language.events.logs.scheduledEvent;
   const event = 'stageInstance' in c ? c.stageInstance?.guildScheduledEvent : undefined;

   return [
    {
     author: {
      name: lan.author,
     },
     color: chEval.getColor(await chEval.getBotMemberFromGuild(g)),
     description: `**${language.slashCommands.info.basic}**\n${[
      {
       name: chEval.util.makeBold(language.t.name),
       value: `\`${c.name}\`\n`,
      },
      {
       name: chEval.util.makeBold('ID'),
       value: `\`${c.id}\`\n`,
      },
      {
       name: chEval.util.makeBold(language.t.createdAt),
       value: `${chEval.constants.standard.getTime(c.createdTimestamp ?? 0)}\n`,
      },
      {
       name: chEval.util.makeBold(language.t.Type),
       value: `\`${language.channelTypes[c.type]}\`\n`,
      },
      'nsfw' in c
       ? {
          name: chEval.util.makeBold(eventLan.nsfw),
          value: `${chEval.settingsHelpers.embedParsers.boolean(c.nsfw, language)}\n`,
         }
       : undefined,
      'defaultAutoArchiveDuration' in c && c.defaultAutoArchiveDuration
       ? {
          name: chEval.util.makeBold(language.t.defaultAutoArchiveDurationName),
          value: `\`${language.defaultAutoArchiveDuration[c.defaultAutoArchiveDuration]}\`\n`,
         }
       : undefined,
      'parent' in c && c.parent
       ? {
          name: `${chEval.util.makeBold(eventLan.parentChannel)}\n`,
          value: language.languageFunction.getChannel(
           c.parent,
           language.channelTypes[c.parent.type],
          ),
         }
       : undefined,
      'rateLimitPerUser' in c && c.rateLimitPerUser
       ? {
          name: chEval.util.makeBold(eventLan.rateLimitPerUser),
          value: `\`${chEval.moment(c.rateLimitPerUser * 1000, language)}\`\n`,
         }
       : undefined,
      'bitrate' in c && c.bitrate
       ? {
          name: chEval.util.makeBold(eventLan.bitrate),
          value: `\`${c.bitrate / 1000}kbps\`\n`,
         }
       : undefined,
      'rtcRegion' in c && c.rtcRegion
       ? {
          name: chEval.util.makeBold(eventLan.rtcRegion),
          value: `\`${c.rtcRegion}\`${
           language.t.regions[c.rtcRegion as keyof typeof language.t.regions]
            ? ` / \`${language.t.regions[c.rtcRegion as keyof typeof language.t.regions]}\``
            : ''
          }\n`,
         }
       : undefined,
      'videoQualityMode' in c && c.videoQualityMode
       ? {
          name: chEval.util.makeBold(eventLan.videoQualityModeName),
          value: `\`${eventLan.videoQualityMode[c.videoQualityMode]}\`\n`,
         }
       : undefined,
      'defaultForumLayout' in c
       ? {
          name: chEval.util.makeBold(language.t.defaultForumLayoutName),
          value: `${
           language.defaultForumLayout[
            c.defaultForumLayout as keyof typeof language.defaultForumLayout
           ]
          }\n`,
         }
       : undefined,
      'defaultReactionEmoji' in c && c.defaultReactionEmoji?.id
       ? {
          name: `${chEval.util.makeBold(eventLan.defaultReactionEmoji)}\n`,
          value: [1]
           .map(() => {
            const emoji = c.defaultReactionEmoji?.id
             ? g.emojis.cache.get(c.defaultReactionEmoji.id)
             : undefined;

            return emoji ? language.languageFunction.getEmote(emoji) : c.defaultReactionEmoji?.name;
           })
           .join(''),
         }
       : undefined,
      'defaultSortOrder' in c && c.defaultSortOrder
       ? {
          name: chEval.util.makeBold(language.t.defaultSortOrderName),
          value: `${language.defaultSortOrder[c.defaultSortOrder]}\n`,
         }
       : undefined,
      'defaultThreadRateLimitPerUser' in c && c.defaultThreadRateLimitPerUser
       ? {
          name: chEval.util.makeBold(eventLan.defaultThreadRateLimitPerUser),
          value: `\`${chEval.moment(c.defaultThreadRateLimitPerUser * 1000, language)}\`\n`,
         }
       : undefined,
      'flags' in c && c.flags.toArray().length
       ? {
          name: chEval.util.makeBold(eventLan.flagsName),
          value: `\`${c.flags
           .toArray()
           .map((f) => `\`${eventLan.flags[f]}\``)
           .join(', ')}\`\n`,
         }
       : undefined,
     ]
      .filter((v): v is { name: string; value: string } => !!v)
      .map(({ name, value }) => `${name} ${value}`)
      .join('')}`,
     fields: [
      'availableTags' in c && c.availableTags
       ? {
          name: `${chEval.util.makeBold(eventLan.availableTags)}\n`,
          value: `${c.availableTags
           .map((t) =>
            language.languageFunction.getForumTag(
             t,
             (t.emoji?.id ? g.emojis.cache.get(t.emoji.id) : t.emoji?.name) ?? undefined,
            ),
           )
           .join('\n')}\n`,
         }
       : undefined,
      'topic' in c && c.topic
       ? {
          name: language.t.Description,
          value: member?.permissionsIn(c).has(BigInt(ViewChannel))
           ? c.topic
           : `[${language.t.Redacted.toUpperCase()}]`,
         }
       : undefined,
      'stageInstance' in c && c.stageInstance
       ? {
          name: lan.stageInstanceName,
          value: [
           c.stageInstance.topic
            ? {
               name: `**${language.t.Topic}**`,
               value: `\`${c.stageInstance.topic}\`\n`,
              }
            : undefined,
           c.stageInstance.privacyLevel
            ? {
               name: `**${eventLan.privacyLevelName}**`,
               value: `\`${eventLan.privacyLevel[c.stageInstance.privacyLevel]}\`\n`,
              }
            : undefined,
           c.stageInstance.createdTimestamp
            ? {
               name: `**${language.t.createdAt}**`,
               value: `${chEval.constants.standard.getTime(c.stageInstance.createdTimestamp)}\n`,
              }
            : undefined,
          ]
           .filter((v): v is { name: string; value: string } => !!v)
           .map(({ name, value }) => `${name} ${value}`)
           .join(''),
         }
       : undefined,
     ].filter((v): v is { name: string; value: string } => !!v),
    } as Discord.APIEmbed,
    'children' in c && c.children.cache.size
     ? {
        color: chEval.getColor(await chEval.getBotMemberFromGuild(g)),
        description: c.children.cache
         .map((child) =>
          language.languageFunction.getChannel(child, language.channelTypes[child.type]),
         )
         .join(''),
       }
     : undefined,
    event
     ? {
        author: {
         name: lan.scheduledEvent.author,
        },
        color: chEval.getColor(await chEval.getBotMemberFromGuild(g)),
        image: {
         url: event.coverImageURL({ size: 4096 }),
        },
        description: [
         {
          name: `**${language.t.name}**`,
          value: `\`${event.name}\`\n`,
         },
         {
          name: '**ID**',
          value: `\`${event.id}\`\n`,
         },
         event.creator
          ? {
             name: `**${scheduledEventLan.creator}**\n`,
             value: language.languageFunction.getUser(event.creator),
            }
          : undefined,
         event.channel
          ? {
             name: `**${language.t.Channel}**\n`,
             value: language.languageFunction.getChannel(
              event.channel,
              language.channelTypes[event.channel.type],
             ),
            }
          : undefined,
         event.scheduledStartTimestamp
          ? {
             name: `**${scheduledEventLan.scheduledStartTime}**\n`,
             value: `${chEval.constants.standard.getTime(event.scheduledStartTimestamp)}\n`,
            }
          : undefined,
         event.scheduledEndTimestamp
          ? {
             name: `**${scheduledEventLan.scheduledEndTime}**\n`,
             value: `${chEval.constants.standard.getTime(event.scheduledEndTimestamp)}\n`,
            }
          : undefined,
         event.url
          ? {
             name: '**URL**\n',
             value: `${event.url}\n`,
            }
          : undefined,
         event.userCount
          ? {
             name: `**${lan.scheduledEvent.userCount}**`,
             value: `\`${event.userCount}\`\n`,
            }
          : undefined,
         event.privacyLevel
          ? {
             name: `**${scheduledEventLan.privacyLevelName}**`,
             value: `\`${scheduledEventLan.privacyLevel[event.privacyLevel]}\`\n`,
            }
          : undefined,
         event.status
          ? {
             name: `**${scheduledEventLan.statusName}**`,
             value: `\`${scheduledEventLan.status[event.status]}\`\n`,
            }
          : undefined,
         event.entityType && event.entityMetadata?.location
          ? {
             name: `**${scheduledEventLan.location}**\n`,
             value: `\`${event.entityMetadata?.location}\``,
            }
          : undefined,
        ]
         .filter((f): f is { name: string; value: string } => !!f)
         .map(({ name, value }) => `${name} ${value}`)
         .join(''),
        fields: [
         event.description
          ? {
             name: language.t.Description,
             value: event.description,
            }
          : undefined,
        ].filter((f): f is { name: string; value: string; inline?: boolean } => !!f),
       }
     : undefined,
   ].filter((e): e is Discord.APIEmbed => !!e);
  },
  {
   context: {
    id: channelID,
    gid: guildID,
    mid: userID,
    ViewChannel: String(Discord.PermissionsBitField.Flags.ViewChannel),
   },
  },
 ) as Promise<Discord.APIEmbed[] | undefined>;
