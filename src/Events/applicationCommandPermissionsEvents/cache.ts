import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (
 data: Discord.ApplicationCommandPermissionsUpdateData,
 guild: Discord.Guild,
) => {
 const cache = () => {
  ch.cache.commandPermissions.set(
   guild.id,
   data.id,
   structuredClone(data.permissions) as Discord.ApplicationCommandPermissions[],
  );
 };

 const customBot = await ch.getBotIdFromGuild(guild);
 if (customBot) cache();
 else if (data.applicationId === client.user?.id) cache();
};
