import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) {
  cmd.client.util.guildOnly(cmd);
  return;
 }
 const ephemeral = cmd.options.getBoolean('hide', false) ?? true;
 const channel = cmd.options.getChannel('channel', true);
 const language = await cmd.client.util.getLanguage(cmd.guildId);

 if (!channel) {
  cmd.client.util.errorCmd(cmd, language.errors.channelNotFound, language);
  return;
 }

 const embeds = (await getEmbed(channel.id, cmd.guildId, cmd.user.id))?.flat();

 if (!embeds) {
  cmd.client.util.errorCmd(cmd, language.errors.channelNotFound, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, {
  ephemeral,
  embeds,
 });
};

const getEmbed = async (
 channelId: string,
 guildId: string,
 userId: string,
): Promise<Discord.APIEmbed[] | undefined> =>
 client.cluster?.broadcastEval(
  async (cl, { id, gid, mid, ViewChannel }) => {
   const g = cl.guilds?.cache.get(gid);
   if (!g) return undefined;

   const rawMember = await cl.util.request.guilds.getMember(g, mid);
   const member = 'message' in rawMember ? undefined : rawMember;

   const c = cl.channels?.cache.get(id) as Discord.GuildBasedChannel;
   if (!c) return undefined;

   const language = await cl.util.getLanguage(gid);
   const lan = language.slashCommands.info.channel;
   const eventLan = language.events.logs.channel;
   const scheduledEventLan = language.events.logs.scheduledEvent;
   const event = 'stageInstance' in c ? c.stageInstance?.guildScheduledEvent : undefined;

   return [
    {
     author: {
      name: lan.author,
     },
     color: cl.util.getColor(await cl.util.getBotMemberFromGuild(g)),
     description: `**${language.slashCommands.info.basic}**\n${[
      {
       name: cl.util.util.makeBold(language.t.name),
       value: `\`${c.name}\`\n`,
      },
      {
       name: cl.util.util.makeBold('ID'),
       value: `\`${c.id}\`\n`,
      },
      {
       name: cl.util.util.makeBold(language.t.createdAt),
       value: `${cl.util.constants.standard.getTime(c.createdTimestamp ?? 0)}\n`,
      },
      {
       name: cl.util.util.makeBold(language.t.Type),
       value: `\`${language.channelTypes[c.type]}\`\n`,
      },
      'nsfw' in c
       ? {
          name: cl.util.util.makeBold(eventLan.nsfw),
          value: `${cl.util.settingsHelpers.embedParsers.boolean(c.nsfw, language)}\n`,
         }
       : undefined,
      'defaultAutoArchiveDuration' in c && c.defaultAutoArchiveDuration
       ? {
          name: cl.util.util.makeBold(language.t.defaultAutoArchiveDurationName),
          value: `\`${language.defaultAutoArchiveDuration[c.defaultAutoArchiveDuration]}\`\n`,
         }
       : undefined,
      'parent' in c && c.parent
       ? {
          name: `${cl.util.util.makeBold(eventLan.parentChannel)}\n`,
          value: language.languageFunction.getChannel(
           c.parent,
           language.channelTypes[c.parent.type],
          ),
         }
       : undefined,
      'rateLimitPerUser' in c && c.rateLimitPerUser
       ? {
          name: cl.util.util.makeBold(eventLan.rateLimitPerUser),
          value: `\`${cl.util.moment(c.rateLimitPerUser * 1000, language)}\`\n`,
         }
       : undefined,
      'bitrate' in c && c.bitrate
       ? {
          name: cl.util.util.makeBold(eventLan.bitrate),
          value: `\`${c.bitrate / 1000}kbps\`\n`,
         }
       : undefined,
      'rtcRegion' in c && c.rtcRegion
       ? {
          name: cl.util.util.makeBold(eventLan.rtcRegion),
          value: `\`${c.rtcRegion}\`${
           language.regions[c.rtcRegion as keyof typeof language.regions]
            ? ` / \`${language.regions[c.rtcRegion as keyof typeof language.regions]}\``
            : ''
          }\n`,
         }
       : undefined,
      'videoQualityMode' in c && c.videoQualityMode
       ? {
          name: cl.util.util.makeBold(eventLan.videoQualityModeName),
          value: `\`${eventLan.videoQualityMode[c.videoQualityMode]}\`\n`,
         }
       : undefined,
      'defaultForumLayout' in c
       ? {
          name: cl.util.util.makeBold(language.t.defaultForumLayoutName),
          value: `${
           language.defaultForumLayout[
            c.defaultForumLayout as keyof typeof language.defaultForumLayout
           ]
          }\n`,
         }
       : undefined,
      'defaultReactionEmoji' in c && c.defaultReactionEmoji?.id
       ? {
          name: `${cl.util.util.makeBold(eventLan.defaultReactionEmoji)}\n`,
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
          name: cl.util.util.makeBold(language.t.defaultSortOrderName),
          value: `${language.defaultSortOrder[c.defaultSortOrder]}\n`,
         }
       : undefined,
      'defaultThreadRateLimitPerUser' in c && c.defaultThreadRateLimitPerUser
       ? {
          name: cl.util.util.makeBold(eventLan.defaultThreadRateLimitPerUser),
          value: `\`${cl.util.moment(c.defaultThreadRateLimitPerUser * 1000, language)}\`\n`,
         }
       : undefined,
      'flags' in c && c.flags.toArray().length
       ? {
          name: cl.util.util.makeBold(eventLan.flagsName),
          value: `\`${c.flags
           .toArray()
           .map((f) => `\`${language.events.logs.guild.systemChannelFlags[f]}\``)
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
          name: `${cl.util.util.makeBold(eventLan.availableTags)}\n`,
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
               value: `${cl.util.constants.standard.getTime(c.stageInstance.createdTimestamp)}\n`,
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
        color: cl.util.getColor(await cl.util.getBotMemberFromGuild(g)),
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
        color: cl.util.getColor(await cl.util.getBotMemberFromGuild(g)),
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
             value: `${cl.util.constants.standard.getTime(event.scheduledStartTimestamp)}\n`,
            }
          : undefined,
         event.scheduledEndTimestamp
          ? {
             name: `**${scheduledEventLan.scheduledEndTime}**\n`,
             value: `${cl.util.constants.standard.getTime(event.scheduledEndTimestamp)}\n`,
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
    id: channelId,
    gid: guildId,
    mid: userId,
    ViewChannel: String(Discord.PermissionsBitField.Flags.ViewChannel),
   },
  },
 ) as Promise<Discord.APIEmbed[] | undefined>;
