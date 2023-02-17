import type * as Discord from 'discord.js';
import type DBT from '../../../Typings/DataBaseTypings';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (msg: Discord.Message) => {
  if (msg.author.bot) return;

  const sticky = await ch
    .query(
      `SELECT * FROM stickymessages WHERE guildid = $1 AND channelid = $2 AND active = true;`,
      [msg.guildId, msg.channel.id],
    )
    .then((r: DBT.stickymessages[] | null) => r || null);
  if (!sticky) return;

  sticky.forEach(async (s) => {
    const oldMessage = await msg.channel.messages.fetch(s.lastmsgid).catch(() => undefined);
    if (!oldMessage) return;

    const m = await ch.send(msg.channel, {
      embeds: oldMessage.embeds.map((e) => e.data),
      files: (await Promise.all(oldMessage.attachments.map((a) => ch.fileURL2Buffer([a.url]))))
        .flat()
        .filter((a): a is Discord.AttachmentPayload => !!a),
      content: oldMessage.content,
    });

    if (!m) return;
    if (oldMessage.deletable) oldMessage.delete().catch(() => undefined);

    ch.query(`UPDATE stickymessages SET lastmsgid = $1 WHERE uniquetimestamp = $2;`, [
      m.id,
      s.uniquetimestamp,
    ]);
  });
};
