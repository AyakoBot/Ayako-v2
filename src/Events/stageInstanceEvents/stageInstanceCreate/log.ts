import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (stage: DDeno.StageInstance) => {
  const channels = await client.ch.getLogChannels('stageevents', stage);
  if (!channels) return;

  const guild = await client.ch.cache.guilds.get(stage.id);
  if (!guild) return;

  const channel = await client.ch.cache.channels.get(stage.channelId, stage.guildId);
  if (!channel) return;

  const language = await client.ch.languageSelector(stage.guildId);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.channel;
  const audit = await client.ch.getAudit(guild, 83, stage.id);
  const auditUser =
    audit && audit.userId ? await client.ch.cache.users.get(audit.userId) : undefined;
  const files: DDeno.FileContent[] = [];

  const embed: DDeno.Embed = {
    author: {
      name: lan.nameStageCreate,
      iconUrl: con.StageCreate,
    },
    color: client.customConstants.colors.loading,
    description: auditUser
      ? lan.descCreateStageAudit(channel, language.channelTypes[channel.type], auditUser)
      : lan.descCreateStage(channel, language.channelTypes[channel.type]),
  };

  if (stage.guildScheduledEventId) {
    const scheduledEvent = await client.ch.cache.scheduledEvents.get(
      stage.guildScheduledEventId,
      stage.guildId,
    );

    embed.fields?.push({
      name: language.ScheduledEvent,
      value: scheduledEvent
        ? language.languageFunction.getScheduledEvent(scheduledEvent)
        : language.unknown,
    });
  }

  if (stage.topic) {
    embed.fields?.push({
      name: lan.topic,
      value: stage.topic,
    });
  }

  if (stage.channelId) {
    const ch = await client.ch.cache.channels.get(stage.channelId, stage.guildId);

    embed.fields?.push({
      name: lan.topic,
      value: ch
        ? language.languageFunction.getChannel(ch, language.channelTypes[ch.type])
        : language.unknown,
    });
  }

  client.ch.send(
    { id: channels, guildId: stage.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
