import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (role: Discord.Role) => {
 ch.DataBase.customroles
  .deleteMany({
   where: {
    roleid: role.id,
   },
  })
  .then();
};
