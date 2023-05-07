import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../Typings/DataBaseTypings';

export default async (msg: Discord.Message) => {
 if (!msg.inCachedGuild()) return;
 if (msg.author?.bot) return;

 const stickyMessage = await ch
  .query(`SELECT * FROM stickymessages WHERE guildid = $1 AND channelid = $2;`, [
   msg.guildId,
   msg.channelId,
  ])
  .then((r: DBT.stickymessages[] | null) => (r ? r[0] : null));

 if (!stickyMessage) return;

 const message = await msg.channel.messages.fetch(stickyMessage.lastmsgid).catch(() => undefined);

 if (!message) {
  ch.query(`DELETE FROM stickymessages WHERE guildid = $1 AND channelid = $2;`, [
   msg.guildId,
   msg.channelId,
  ]);
  return;
 }

 const language = await ch.languageSelector(msg.guildId);
 const lan = language.contextCommands.message['stick-message'];

 const m = await ch.send(msg.channel, {
  content: message.content,
  embeds: message.embeds.map((e) => e.data),
  files: message.attachments.map((a) => a),
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      label: lan.button,
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      disabled: true,
      customId: String(Math.random() * Date.now()),
     },
    ],
   },
  ],
 });

 if (!m) return;
 if (message.deletable) message.delete().catch(() => undefined);

 ch.query(`UPDATE stickymessages SET lastmsgid = $1 WHERE guildid = $2 AND channelid = $3;`, [
  m.id,
  msg.guildId,
  msg.channelId,
 ]);
};
