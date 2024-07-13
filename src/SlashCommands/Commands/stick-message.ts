import * as Discord from 'discord.js';

export default new Discord.ContextMenuCommandBuilder()
 .setName('Stick Message')
 .setDefaultMemberPermissions(Discord.PermissionsBitField.Flags.ManageMessages)
 .setType(Discord.ApplicationCommandType.Message)
 .setContexts([Discord.InteractionContextType.Guild])
 .setIntegrationTypes([Discord.ApplicationIntegrationType.GuildInstall]);
