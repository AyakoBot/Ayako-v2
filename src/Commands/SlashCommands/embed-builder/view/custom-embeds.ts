import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as DBT from '../../../../Typings/DataBaseTypings';

export default async (cmd: Discord.CommandInteraction) => {
 const value = cmd.options.get('embed', true).value as string;
 const embedData = await ch
  .query(`SELECT * FROM customembeds WHERE uniquetimestamp = $1 AND guildid = $2;`, [
   value,
   cmd.guildId,
  ])
  .then((r: DBT.customembeds[] | null) => (r ? r[0] : null));

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.view['custom-embeds'];

 if (!embedData) {
  ch.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const embed = ch.getDiscordEmbed(embedData);
 const embedCode = JSON.stringify(embed, null, 2);
 const attachment = ch.txtFileWriter(embedCode);

 if (!attachment) return;

 ch.replyCmd(cmd, {
  ephemeral: true,
  files: [attachment],
 });
};
