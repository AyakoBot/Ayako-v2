import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ModalSubmitInteraction) => {
 if (!cmd.isFromMessage()) return;

 const name = cmd.fields.getTextInputValue('name');
 const embed = new Discord.EmbedBuilder(cmd.message.embeds[0].data).data;

 ch.query(
  `INSERT INTO customembeds 
  (color, title, url, authorname, authoriconurl, authorurl, description, thumbnail, fieldnames, fieldvalues, fieldinlines, image, footertext, footericonurl, uniquetimestamp, guildid, name, timestamp) 
  VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18);`,
  [
   embed.color ?? null,
   embed.title ?? null,
   embed.url ?? null,
   embed.author?.name ?? null,
   embed.author?.icon_url ?? null,
   embed.author?.url ?? null,
   embed.description ?? null,
   embed.thumbnail?.url ?? null,
   embed.fields?.map((o) => o.name) ?? null,
   embed.fields?.map((o) => o.value) ?? null,
   embed.fields?.map((o) => o.inline) ?? null,
   embed.image?.url ?? null,
   embed.footer?.text ?? null,
   embed.footer?.icon_url ?? null,
   Date.now(),
   cmd.guildId,
   name,
   embed.timestamp ?? null,
  ],
 );

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.save;

 cmd.reply({
  content: lan.saved,
  ephemeral: true,
 });
};
