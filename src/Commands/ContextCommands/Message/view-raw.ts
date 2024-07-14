import * as Discord from 'discord.js';

export default async (cmd: Discord.MessageContextMenuCommandInteraction) => {
 const json = JSON.stringify(cmd.targetMessage.toJSON(), null, 2);

 if (json.length > 4090) {
  const file = cmd.client.util.txtFileWriter(json, undefined, 'Raw_Message');
  cmd.client.util.replyCmd(cmd, { files: [file] });

  return;
 }

 if (json.length > 2040) {
  cmd.client.util.replyCmd(cmd, {
   embeds: [
    {
     description: Discord.codeBlock('json', Discord.cleanCodeBlockContent(json)),
     color: cmd.client.util.Colors.Ephemeral,
    },
   ],
  });
  return;
 }

 cmd.client.util.replyCmd(cmd, {
  content: Discord.codeBlock('json', Discord.cleanCodeBlockContent(json)),
 });
};
