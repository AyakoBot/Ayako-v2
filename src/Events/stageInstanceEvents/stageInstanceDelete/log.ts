import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (stage: Discord.StageInstance) => {
 if (!stage.guild) return;
 if (!stage.channel) return;

 const channels = await stage.client.util.getLogChannels('stageevents', stage.guild);
 if (!channels) return;

 const language = await stage.client.util.getLanguage(stage.guild.id);
 const lan = language.events.logs.channel;
 const con = stage.client.util.constants.events.logs.channel;
 const audit = await stage.client.util.getAudit(stage.guild, 83, stage.id);
 const auditUser = audit?.executor ?? undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameStageDelete,
   icon_url: con.StageDelete,
  },
  color: CT.Colors.Danger,
  description: auditUser
   ? lan.descDeleteStageAudit(stage.channel, language.channelTypes[stage.channel.type], auditUser)
   : lan.descDeleteStage(stage.channel, language.channelTypes[stage.channel.type]),
  fields: [],
  timestamp: new Date().toISOString(),
 };

 if (stage.guildScheduledEvent) {
  embed.fields?.push({
   name: language.t.ScheduledEvent,
   value: language.languageFunction.getScheduledEvent(stage.guildScheduledEvent),
  });
 }

 if (stage.topic) {
  embed.fields?.push({
   name: lan.topic,
   value: stage.topic,
  });
 }

 stage.client.util.send(
  { id: channels, guildId: stage.guild.id },
  { embeds: [embed], files },
  10000,
 );
};
