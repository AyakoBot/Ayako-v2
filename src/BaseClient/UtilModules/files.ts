import { Prisma } from '@prisma/client';
import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

import pack from '../../../package.json' assert { type: 'json' };
import constants from '../Other/constants.js';
import SlashCommands from '../../SlashCommands/index.js';

import * as endGiveaway from '../../Commands/SlashCommands/giveaway/end.js';
import * as createReminder from '../../Commands/SlashCommands/reminder/create.js';
import * as Typings from '../../Typings/Typings.js';
import * as Settings from '../../Typings/Settings.js';
import mod from './mod.js';
import * as requestHandler from './requestHandler.js';

const self = {
 // Packages
 prisma: Prisma,
 jobs: Jobs,
 discord: Discord,
 sharding: Sharding,

 // File
 SlashCommands: {
  version: 0,
  reload: () => {
   self.SlashCommands.version += 1;
  },
  get: (): Promise<typeof SlashCommands> =>
   import(`../../SlashCommands/index.js?version=${self.SlashCommands.version}`),
 },
 Typings: {
  Typings: {
   version: 0,
   reload: () => {
    self.Typings.Typings.version += 1;
   },
   get: (): Promise<typeof Typings> =>
    import(`../../Typings/Typings.js?version=${self.Typings.Typings.version}`),
  },
  Settings: {
   version: 0,
   reload: () => {
    self.Typings.Settings.version += 1;
   },
   get: (): Promise<typeof Settings> =>
    import(`../../Typings/Settings.js?version=${self.Typings.Settings.version}`),
  },
 },
 package: {
  version: 0,
  reload: () => {
   self.package.version += 1;
  },
  get: (): Promise<typeof pack> => import(`../../../package.json?version=${self.package.version}`),
 },
 Commands: {
  SlashCommands: {
   giveaway: {
    end: {
     version: 0,
     reload: () => {
      self.Commands.SlashCommands.giveaway.end.version += 1;
     },
     get: (): Promise<typeof endGiveaway> =>
      import(
       `../../Commands/SlashCommands/giveaway/end.js?version=${self.Commands.SlashCommands.giveaway.end.version}`
      ),
    },
   },
   reminder: {
    create: {
     version: 0,
     reload: () => {
      self.Commands.SlashCommands.reminder.create.version += 1;
     },
     get: (): Promise<typeof createReminder> =>
      import(
       `../../Commands/SlashCommands/reminder/create.js?version=${self.Commands.SlashCommands.reminder.create.version}`
      ),
    },
   },
  },
 },
 BaseClient: {
  Other: {
   constants: {
    version: 0,
    reload: () => {
     self.BaseClient.Other.constants.version += 1;
    },
    get: (): Promise<typeof constants> =>
     import(
      `../../BaseClient/Other/constants.js?version=${self.BaseClient.Other.constants.version}`
     ),
   },
   UtilModules: {
    requestHandler: {
     version: 0,
     reload: () => {
      self.BaseClient.Other.UtilModules.requestHandler.version += 1;
     },
     get: (): Promise<typeof requestHandler> =>
      import(
       `../../BaseClient/UtilModules/requestHandler.js?version=${self.BaseClient.Other.UtilModules.requestHandler.version}`
      ),
    },
    mod: {
     version: 0,
     reload: () => {
      self.BaseClient.Other.UtilModules.mod.version += 1;
     },
     get: (): Promise<typeof mod> =>
      import(
       `../../BaseClient/UtilModules/mod.js?version=${self.BaseClient.Other.UtilModules.mod.version}`
      ),
    },
   },
  },
 },
};

export default self;
