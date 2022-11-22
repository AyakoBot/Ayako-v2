import type * as DDeno from 'discordeno';
import permissionCalculators from './permissionCalculators.js';

export default (userID: bigint, channel: DDeno.Channel) => {
  const overwrites = channel.permissionOverwrites;
  if (!overwrites) return undefined;

  const bigints = overwrites
    .map((p) => permissionCalculators.separateOverwrites(p))
    .filter((v): v is [number, bigint, bigint, bigint] => v[1] === userID);

  if (!bigints) return null;

  return {
    id: bigints[1],
    allow: bigints[2],
    deny: bigints[3],
  };
};
