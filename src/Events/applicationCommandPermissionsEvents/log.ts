import * as Discord from 'discord.js';
import * as CT from '../../Typings/Typings.js';

export default async (
 data: Discord.ApplicationCommandPermissionsUpdateData,
 guild: Discord.Guild,
) => {
 const channels = await guild.client.util.getLogChannels('applicationevents', guild);
 if (!channels) return;

 const application = await guild.client.util.getUser(data.applicationId);
 if (!application) return;

 const language = await guild.client.util.getLanguage(guild.id);
 const lan = language.events.logs.application;
 const con = guild.client.util.constants.events.logs.guild;
 const audit = await guild.client.util.getAudit(guild, 121, data.id);
 const auditUser = audit?.executor ?? undefined;
 if (!audit || !auditUser) return;

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.name,
   icon_url: con.BotUpdate,
  },
  color: CT.Colors.Loading,
  description:
   audit.targetId !== application.id
    ? lan.descUpdateCommand(application, auditUser, audit.target as Discord.ApplicationCommand)
    : lan.descUpdateAll(application, auditUser),
  fields: [],
 };

 const permEmbed = {
  color: CT.Colors.Ephemeral,
  description: `${data.permissions
   .map((permission) => {
    const type = () => {
     if (permission.id === guild.id) return `<@&${guild.id}>`;
     if (BigInt(permission.id) === BigInt(guild.id) - 1n) return `All Channels`;
     if (permission.type === Discord.ApplicationCommandPermissionType.Channel) {
      return `<#${permission.id}>`;
     }
     if (permission.type === Discord.ApplicationCommandPermissionType.Role) {
      return `<@&${permission.id}>`;
     }
     if (permission.type === Discord.ApplicationCommandPermissionType.User) {
      return `<@${permission.id}>`;
     }
     return 5;
    };

    return `${type() === 5 ? language.t.Unknown : type()} ${
     permission.permission ? guild.client.util.emotes.enabled : guild.client.util.emotes.disabled
    }`;
   })
   .join('\n')}`,
 };

 const embeds = [embed, permEmbed];
 if (!permEmbed.description?.length) return;

 guild.client.util.send({ id: channels, guildId: guild.id }, { embeds }, 10000);
};
