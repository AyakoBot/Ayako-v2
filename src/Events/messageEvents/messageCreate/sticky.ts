import type * as Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import client from '../../../BaseClient/Client.js';

export default async (msg: CT.GuildMessage) => {
  if (msg.author.bot) return;

  const sticky = await client.ch
    .query(
      `SELECT * FROM stickymessages WHERE guildid = $1 AND channelid = $2 AND active = true;`,
      [msg.guild.id, msg.channel.id],
    )
    .then((r: DBT.stickymessages[] | null) => r || null);

  if (!sticky) return;

  sticky.forEach(async (s) => {
    const oldMessage = await msg.channel.messages.fetch(s.lastmsgid).catch(() => undefined);
    if (!oldMessage) return;

    const m = await client.ch.send(
      msg.channel,
      {
        embeds: oldMessage.embeds,
        files: (
          await Promise.all(oldMessage.attachments.map((a) => client.ch.fileURL2Buffer([a.url])))
        )
          .flat()
          .filter((a): a is Discord.AttachmentPayload => !!a),
        content: oldMessage.content,
      },
      msg.language,
    );

    if (!m) return;
    if (oldMessage.deletable) oldMessage.delete().catch(() => undefined);

    client.ch.query(`UPDATE lastmsgid = $1 FROM stickymessages WHERE uniquetimestamp = $2;`, [
      m.id,
      s.uniquetimestamp,
    ]);
  });
};
