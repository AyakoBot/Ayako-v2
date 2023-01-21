import client from '../../../BaseClient/Client.js';

export default () => {
  let totalrolecount = 0;
  let totalusers = 0;
  let totalchannelcount = 0;

  client.guilds.cache.forEach((guild) => {
    totalrolecount += guild.roles.cache.size;
    if (guild.memberCount) totalusers += guild.memberCount;
    totalchannelcount += guild.channels.cache.size;
  });

  client.ch.query(
    `UPDATE stats SET usercount = $1, guildcount = $2, channelcount = $3, rolecount = $4, allusers = $5;`,
    [
      client.users.cache.size,
      client.guilds.cache.size,
      totalchannelcount,
      totalrolecount,
      totalusers,
    ],
  );
};
