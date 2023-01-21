import * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';

export default async (
  data: Discord.ApplicationCommandPermissionsUpdateData,
  guild: Discord.Guild,
) => {
  const channels = await client.ch.getLogChannels('applicationevents', guild);
  if (!channels) return;

  const application = await client.users.fetch(data.applicationId);
  if (!application) return;

  const command = await guild.commands.fetch(data.id);
  if (!command) return;

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.application;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(guild, 31, data.id);
  const auditUser = audit?.executor ?? undefined;

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.name,
      icon_url: con.BotUpdate,
    },
    color: client.customConstants.colors.loading,
    description: auditUser
      ? lan.descUpdateAudit(application, auditUser, command)
      : lan.descUpdate(application, command),
    fields: [],
  };

  const permEmbed = {
    color: client.customConstants.colors.ephemeral,
    description: `${data.permissions
      .map((permission) => {
        const getType = () => {
          if (permission.id === guild.id) return `<@&${guild.id}>`;
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

        const type = getType();

        return `${type === 5 ? lan.allChannels : type} ${
          permission.permission ? client.stringEmotes.enabled : client.stringEmotes.disabled
        }`;
      })
      .join('\n')}`,
  };

  const embeds = [embed, permEmbed];

  client.ch.send({ id: channels, guildId: guild.id }, { embeds }, language, undefined, 10000);
};
