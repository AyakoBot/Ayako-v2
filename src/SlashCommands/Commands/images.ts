import * as Discord from 'discord.js';

export const ephemeral = new Discord.SlashCommandBooleanOption()
 .setName('hide')
 .setDescription('Whether to hide the Response and make it ephemeral')
 .setRequired(false);

const categories = {
 neko: 'Get a random Neko Image',
 husbando: 'Get a random Husbando Image',
 kitsune: 'Get a random Kitsune Image',
 waifu: 'Get a random Waifu Image',
 shinobu: 'Get a random Shinobu Image',
 megumin: 'Get a random Megumin Image',
 eevee: 'Get a random Eevee Image',
 holo: 'Get a random Holo Image',
 icon: 'Get a random Anime Icon',
 okami: 'Get a random Okami Image',
 senko: 'Get a random Senko Image',
 shiro: 'Get a random Shiro Image',
};

const images = new Discord.SlashCommandBuilder()
 .setName('images')
 .setDescription('Get a random Image')
 .setContexts([
  Discord.InteractionContextType.BotDM,
  Discord.InteractionContextType.Guild,
  Discord.InteractionContextType.PrivateChannel,
 ])
 .setIntegrationTypes([
  Discord.ApplicationIntegrationType.GuildInstall,
  Discord.ApplicationIntegrationType.UserInstall,
 ]);

Object.entries(categories).forEach(([name, description]) => {
 images.addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName(name)
   .setDescription(description)
   .addBooleanOption(ephemeral),
 );
});

export default images;
