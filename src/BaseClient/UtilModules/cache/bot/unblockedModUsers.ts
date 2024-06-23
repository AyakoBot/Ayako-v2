import * as Jobs from 'node-schedule';
import { ModTypes } from '../../../../Typings/Typings.js';
import getPathFromError from '../../getPathFromError.js';

export type Cmd = { guildId: string; channelId: string; authorId: string };

/**
 * Interface for managing released mod actions.
 */
export interface UnblockedModUsers {
 /**
  * Sets an unblocked User
  * @param cmd - The base Command.
  * @param type - The Mod type this User is unblocked from.
  * @param target - The User ID that is unblocked.
  */
 set: (cmd: Cmd, type: ModTypes, targetId: string) => void;

 /**
  * Deletes an unblocked User
  * @param cmd - The base Command.
  * @param type - The Mod type this User is unblocked from.
  * @param target - The User ID that is unblocked.
  */
 delete: (cmd: Cmd, type: ModTypes, targetId: string) => void;

 /**
  * Checks if a User is unblocked.
  * @param cmd - The base Command.
  * @param type - The Mod type this User is unblocked from.
  * @param target - The User ID that is unblocked.
  */
 has: (cmd: Cmd, type: ModTypes, targetId: string) => boolean;

 /**
  * Map containing the unblocked Users.
  */
 cache: {
  targetId: string;
  executorId: string;
  guildId: string;
  channelId: string;
  type: ModTypes;
  job: Jobs.Job;
 }[];
}

const self: UnblockedModUsers = {
 set: (cmd, type, target) => {
  self.cache.push({
   targetId: target,
   executorId: cmd.authorId,
   guildId: cmd.guildId,
   channelId: cmd.channelId,
   type,
   job: Jobs.scheduleJob(getPathFromError(new Error()), new Date(Date.now() + 60000), () => {
    self.delete(cmd, type, target);
   }),
  });
 },
 delete: (cmd, type, target) => {
  const cache = self.cache.find(
   (u) =>
    u.targetId === target &&
    u.guildId === cmd.guildId &&
    u.executorId === cmd.authorId &&
    u.channelId === cmd.channelId &&
    u.type === type,
  );

  if (cache) Jobs.cancelJob(cache.job);

  self.cache = self.cache.filter(
   (u) =>
    u.targetId !== target &&
    u.guildId !== cmd.guildId &&
    u.executorId !== cmd.authorId &&
    u.channelId !== cmd.channelId &&
    u.type !== type,
  );
 },
 has: (cmd, type, target) =>
  self.cache.some(
   (u) =>
    u.targetId === target &&
    u.guildId === cmd.guildId &&
    u.executorId === cmd.authorId &&
    u.channelId === cmd.channelId &&
    u.type === type,
  ),
 cache: [],
};

export default self;
