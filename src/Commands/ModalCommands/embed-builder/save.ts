import * as Discord from 'discord.js';

export default async (cmd: Discord.ModalSubmitInteraction) => {
 if (!cmd.isFromMessage()) return;
 if (!cmd.inCachedGuild()) return;

 const name = cmd.fields.getTextInputValue('name');
 const embed = new Discord.EmbedBuilder(cmd.message.embeds[1].data).data;

 cmd.client.util.DataBase.customembeds
  .create({
   data: {
    color: embed.color ? String(embed.color) : null,
    title: embed.title ?? null,
    url: embed.url ?? null,
    authorname: embed.author?.name ?? null,
    authoriconurl: embed.author?.icon_url ?? null,
    authorurl: embed.author?.url ?? null,
    description: embed.description ?? null,
    thumbnail: embed.thumbnail?.url ?? null,
    fieldnames: embed.fields?.map((o) => o.name) ?? undefined,
    fieldvalues: embed.fields?.map((o) => o.value) ?? undefined,
    fieldinlines: embed.fields?.map((o) => o.inline || false) ?? undefined,
    image: embed.image?.url ?? null,
    footertext: embed.footer?.text ?? null,
    footericonurl: embed.footer?.icon_url ?? null,
    uniquetimestamp: Date.now(),
    guildid: cmd.guildId,
    name,
    timestamp: embed.timestamp ?? null,
   },
  })
  .then();

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.save;

 cmd.reply({
  content: lan.saved,
  ephemeral: true,
 });
};
