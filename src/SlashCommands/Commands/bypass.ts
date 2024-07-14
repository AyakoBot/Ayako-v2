import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('bypass')
 .setDescription('Bypasses a Member from the Verification-System')
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
 .setContexts([Discord.InteractionContextType.Guild])
 .setIntegrationTypes([Discord.ApplicationIntegrationType.GuildInstall])
 .addUserOption(
  new Discord.SlashCommandUserOption()
   .setName('user')
   .setDescription('The User to bypass')
   .setRequired(true),
 );
