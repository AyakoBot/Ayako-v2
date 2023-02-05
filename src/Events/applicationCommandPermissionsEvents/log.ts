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

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.application;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(guild, 121, data.id);
  const auditUser = audit?.executor ?? undefined;
  if (!audit || !auditUser) return;

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.name,
      icon_url: con.BotUpdate,
    },
    color: client.customConstants.colors.loading,
    description:
      audit.target?.id !== application.id
        ? lan.descUpdateCommand(application, auditUser, audit.target as Discord.ApplicationCommand)
        : lan.descUpdateAll(application, auditUser),
    fields: [],
  };

  const permEmbed = {
    color: client.customConstants.colors.ephemeral,
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

        return `${type() === 5 ? language.unknown : type()} ${
          permission.permission ? client.stringEmotes.enabled : client.stringEmotes.disabled
        }`;
      })
      .join('\n')}`,
  };

  const embeds = [embed, permEmbed];
  if (!permEmbed.description?.length) return;

  client.ch.send({ id: channels, guildId: guild.id }, { embeds }, language, undefined, 10000);
};
