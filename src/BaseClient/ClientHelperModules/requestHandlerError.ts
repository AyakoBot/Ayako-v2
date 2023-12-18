import * as Discord from 'discord.js';
import enGB from '../../Languages/en-GB.json' assert { type: 'json' };

export default (text: string, requiredPerms: bigint[]) =>
 new Error(
  `${text}\n${enGB.permissions.error.needed}: ${requiredPerms
   .map((p) => enGB.permissions.perms[new Discord.PermissionsBitField(p).toArray()[0]])
   .join(', ')}`,
 );
