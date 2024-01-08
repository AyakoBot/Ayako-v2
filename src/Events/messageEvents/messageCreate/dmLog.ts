import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (msg: Discord.Message<boolean>) => {
 const embed: Discord.APIEmbed = {
  description: msg.content,
  color: CT.Colors.Base,
  author: {
   name: msg.author.tag,
   icon_url: msg.author.displayAvatarURL(),
   url: msg.url,
  },
 };

 msg.client.rest.post(`/channels/${msg.client.util.constants.standard.dmLogChannelID}/messages`, {
  body: {
   embeds: [embed],
  },
  files: (await msg.client.util.fileURL2Buffer(msg.attachments.map((o) => o.url)))
   ?.filter((a): a is Discord.AttachmentPayload => !!a)
   .map((attachment) => ({
    data: attachment.attachment as Buffer,
    name: attachment.name ?? 'attachment',
    description: attachment.description,
   })),
 });
};
