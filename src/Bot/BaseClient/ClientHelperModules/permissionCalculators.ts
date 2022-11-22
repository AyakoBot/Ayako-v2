// eslint-disable-next-line import/no-unresolved
import * as permissionCalc from 'discordeno/transformers/channel';
import * as permissionCache from '../Other/permissions-plugin/permissions-plugin/src/permissions.js';

declare function separateOverwrites(v: bigint): [number, bigint, bigint, bigint];

export default {
  permissionCache,
  separateOverwrites: permissionCalc.separateOverwrites as typeof separateOverwrites,
};
