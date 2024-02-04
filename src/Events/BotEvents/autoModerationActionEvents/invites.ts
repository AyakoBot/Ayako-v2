import * as Discord from 'discord.js';
import * as Classes from '../../../BaseClient/Other/classes.js';

export default async (msg: Discord.AutoModerationActionExecution) => {
 const user = msg.user ?? (await msg.guild.client.util.getUser(msg.userId));
 if (!user) return;

 msg.guild.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.invites.file.default(
  new Classes.Message(msg.guild.client, {
   id: msg.messageId ?? msg.alertSystemMessageId ?? msg.ruleId,
   channel_id: msg.channelId ?? msg.ruleId,
   author: {
    id: msg.userId,
    username: user.username,
    discriminator: user.discriminator,
    global_name: user.username,
    avatar: user.avatar,
   },
   content: msg.content,
   timestamp: new Date().toISOString(),
   edited_timestamp: null,
   tts: false,
   mention_everyone: false,
   mentions: [],
   mention_roles: [],
   attachments: [],
   embeds: [],
   pinned: false,
   type: Discord.MessageType.AutoModerationAction,
  }),
 );
};
