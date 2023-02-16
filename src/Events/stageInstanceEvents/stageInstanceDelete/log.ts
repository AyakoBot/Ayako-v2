import type * as Discord from 'discord.js';
import { ch } from '../../../BaseClient/Client.js';

export default async (stage: Discord.StageInstance) => {
  if (!stage.guild) return;
  if (!stage.channel) return;

  const channels = await ch.getLogChannels('stageevents', stage.guild);
  if (!channels) return;

  const language = await ch.languageSelector(stage.guild.id);
  const lan = language.events.logs.channel;
  const con = ch.constants.events.logs.channel;
  const audit = await ch.getAudit(stage.guild, 83, stage.id);
  const auditUser = audit?.executor ?? undefined;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameStageDelete,
      icon_url: con.StageDelete,
    },
    color: ch.constants.colors.danger,
    description: auditUser
      ? lan.descDeleteStageAudit(
          stage.channel,
          language.channelTypes[stage.channel.type],
          auditUser,
        )
      : lan.descDeleteStage(stage.channel, language.channelTypes[stage.channel.type]),
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

  ch.send({ id: channels, guildId: stage.guild.id }, { embeds: [embed], files }, undefined, 10000);
};
