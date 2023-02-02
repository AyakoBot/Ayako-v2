import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (stage: Discord.StageInstance) => {
  if (!stage.guild) return;
  if (!stage.channel) return;

  const channels = await client.ch.getLogChannels('stageevents', stage.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(stage.guild.id);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.channel;
  const audit = await client.ch.getAudit(stage.guild, 83, stage.id);
  const auditUser = audit?.executor ?? undefined;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameStageCreate,
      icon_url: con.StageCreate,
    },
    color: client.customConstants.colors.success,
    description: auditUser
      ? lan.descCreateStageAudit(
          stage.channel,
          language.channelTypes[stage.channel.type],
          auditUser,
        )
      : lan.descCreateStage(stage.channel, language.channelTypes[stage.channel.type]),
    fields: [],
  };

  if (stage.guildScheduledEvent) {
    embed.fields?.push({
      name: language.ScheduledEvent,
      value: language.languageFunction.getScheduledEvent(stage.guildScheduledEvent),
    });
  }

  if (stage.topic) {
    embed.fields?.push({
      name: lan.topic,
      value: stage.topic,
    });
  }

  client.ch.send(
    { id: channels, guildId: stage.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
