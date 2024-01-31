import buttonParsers from './settingsHelpers/buttonParsers.js';
import changeHelpers from './settingsHelpers/changeHelpers.js';
import embedParsers from './settingsHelpers/embedParsers.js';
import multiRowHelpers from './settingsHelpers/multiRowHelpers.js';

const self = {
 buttonParsers,
 changeHelpers,
 embedParsers,
 multiRowHelpers,
 del: {
  reload: async () => {
   self.del.file = await import(`../../../settingsHelpers/del.js?version=${Date.now()}`);
  },
  file: await import(`../../../settingsHelpers/del.js`),
 },
 getChangeSelectType: {
  reload: async () => {
   self.getChangeSelectType.file = await import(
    `../../../settingsHelpers/getChangeSelectType.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../settingsHelpers/getChangeSelectType.js`),
 },
 getEmoji: {
  reload: async () => {
   self.getEmoji.file = await import(`../../../settingsHelpers/getEmoji.js?version=${Date.now()}`);
  },
  file: await import(`../../../settingsHelpers/getEmoji.js`),
 },
 getGlobalDesc: {
  reload: async () => {
   self.getGlobalDesc.file = await import(
    `../../../settingsHelpers/getGlobalDesc.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../settingsHelpers/getGlobalDesc.js`),
 },
 getLable: {
  reload: async () => {
   self.getLable.file = await import(`../../../settingsHelpers/getLable.js?version=${Date.now()}`);
  },
  file: await import(`../../../settingsHelpers/getLable.js`),
 },
 getMention: {
  reload: async () => {
   self.getMention.file = await import(
    `../../../settingsHelpers/getMention.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../settingsHelpers/getMention.js`),
 },
 getPlaceholder: {
  reload: async () => {
   self.getPlaceholder.file = await import(
    `../../../settingsHelpers/getPlaceholder.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../settingsHelpers/getPlaceholder.js`),
 },
 getSettingsFile: {
  reload: async () => {
   self.getSettingsFile.file = await import(
    `../../../settingsHelpers/getSettingsFile.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../settingsHelpers/getSettingsFile.js`),
 },
 getStyle: {
  reload: async () => {
   self.getStyle.file = await import(`../../../settingsHelpers/getStyle.js?version=${Date.now()}`);
  },
  file: await import(`../../../settingsHelpers/getStyle.js`),
 },
 postUpdate: {
  reload: async () => {
   self.postUpdate.file = await import(
    `../../../settingsHelpers/postUpdate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../settingsHelpers/postUpdate.js`),
 },
 setup: {
  reload: async () => {
   self.setup.file = await import(`../../../settingsHelpers/setup.js?version=${Date.now()}`);
  },
  file: await import(`../../../settingsHelpers/setup.js`),
 },
 updateLog: {
  reload: async () => {
   self.updateLog.file = await import(
    `../../../settingsHelpers/updateLog.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../settingsHelpers/updateLog.js`),
 },
};

export default self;
