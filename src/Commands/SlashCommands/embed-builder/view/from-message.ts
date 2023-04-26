import client from '../../../../BaseClient/Client.js';
import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.CommandInteraction) => {
  const link = cmd.options.get('message-link', true).value as string;
  const [, , , gID, cID, mID] = link.split(/\/+/g);

  const language = await ch.languageSelector(cmd.guildId);
  const lan = language.slashCommands.embedbuilder.view['from-message'];

  if (!gID || !cID || !mID) {
    ch.errorCmd(cmd, lan.notALink, language);
    return;
  }

  const response = (
    await client.shard?.broadcastEval(
      async (cl, { gID, cID, mID }) => {
        const guild = cl.guilds.cache.get(gID);
        if (!guild) return undefined;

        const channel = cl.channels.cache.get(cID) as Discord.Channel;
        if (!channel) return undefined;
        if (!('messages' in channel)) return undefined;

        const message = (await channel.messages.fetch(mID).catch(() => undefined)) as
          | Discord.Message
          | undefined;
        return message?.embeds;
      },
      {
        context: { gID, cID, mID },
      },
    )
  )
    ?.flat()
    .find((e): e is Discord.APIEmbed => !!e);

  if (!response) {
    ch.errorCmd(cmd, lan.notALink, language);
    return;
  }

  const embedCode = JSON.stringify(response, null, 2);
  const attachment = ch.txtFileWriter(embedCode);
  
  if (!attachment) return;

  ch.replyCmd(cmd, {
    ephemeral: true,
    files: [attachment],
  });
};
