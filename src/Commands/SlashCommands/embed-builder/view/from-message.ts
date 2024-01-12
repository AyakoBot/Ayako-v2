import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';

export default async (cmd: Discord.CommandInteraction) => {
 const link = cmd.options.get('message-link', true).value as string;
 const [, , , gID, cID, mID] = link.split(/\/+/g);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.view['from-message'];

 if (!gID || !cID || !mID) {
  cmd.client.util.errorCmd(cmd, lan.notALink, language);
  return;
 }

 const response = (
  await client.cluster?.broadcastEval(
   async (cl, { gID: guildID, cID: channelID, mID: messageID }) => {
    const guild = cl.guilds.cache.get(guildID);
    if (!guild) return undefined;

    const channel = cl.channels.cache.get(channelID) as Discord.GuildTextBasedChannel;
    if (!channel) return undefined;
    if (!('messages' in channel)) return undefined;

    const message = await cl.util.request.channels.getMessage(channel, messageID);
    if ('message' in message) return undefined;

    return message?.embeds.map((e) => e);
   },
   {
    context: { gID, cID, mID },
   },
  )
 )
  ?.flat()
  .filter((e): e is Discord.APIEmbed => !!e);

 if (!response) {
  cmd.client.util.errorCmd(cmd, lan.notALink, language);
  return;
 }

 const embedCode = JSON.stringify(response, null, 2);
 const attachment = cmd.client.util.txtFileWriter(embedCode);

 if (!attachment) return;

 cmd.client.util.replyCmd(cmd, {
  ephemeral: true,
  files: [attachment],
 });
};
