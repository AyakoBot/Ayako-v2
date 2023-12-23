import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (stage: Discord.StageInstance) => {
 if (!stage.guild) return;
 if (!stage.channel) return;

 const channels = await ch.getLogChannels('stageevents', stage.guild);
 if (!channels) return;

 const language = await ch.getLanguage(stage.guild.id);
 const lan = language.events.logs.channel;
 const con = ch.constants.events.logs.channel;
 const audit = await ch.getAudit(stage.guild, 83, stage.id);
 const auditUser = audit?.executor ?? undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameStageCreate,
   icon_url: con.StageCreate,
  },
  color: CT.Colors.Success,
  description: auditUser
   ? lan.descCreateStageAudit(stage.channel, language.channelTypes[stage.channel.type], auditUser)
   : lan.descCreateStage(stage.channel, language.channelTypes[stage.channel.type]),
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

 ch.send({ id: channels, guildId: stage.guild.id }, { embeds: [embed], files }, 10000);
};
