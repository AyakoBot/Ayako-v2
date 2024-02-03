const self = {
 reload: async () => {
  self.file = await import(`../../../mod.js?version=${Date.now()}`);
 },
 file: await import(`../../../mod.js`),

 mod: {
  banAdd: {
   reload: async () => {
    self.mod.banAdd.file = await import(`../../../mod/mod/banAdd.js?version=${Date.now()}`);
   },
   file: await import(`../../../mod/mod/banAdd.js`),
  },
  banRemove: {
   reload: async () => {
    self.mod.banRemove.file = await import(`../../../mod/mod/banRemove.js?version=${Date.now()}`);
   },
   file: await import(`../../../mod/mod/banRemove.js`),
  },
  channelBanAdd: {
   reload: async () => {
    self.mod.channelBanAdd.file = await import(
     `../../../mod/mod/channelBanAdd.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../mod/mod/channelBanAdd.js`),
  },
  channelBanRemove: {
   reload: async () => {
    self.mod.channelBanRemove.file = await import(
     `../../../mod/mod/channelBanRemove.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../mod/mod/channelBanRemove.js`),
  },
  kickAdd: {
   reload: async () => {
    self.mod.kickAdd.file = await import(`../../../mod/mod/kickAdd.js?version=${Date.now()}`);
   },
   file: await import(`../../../mod/mod/kickAdd.js`),
  },
  muteRemove: {
   reload: async () => {
    self.mod.muteRemove.file = await import(`../../../mod/mod/muteRemove.js?version=${Date.now()}`);
   },
   file: await import(`../../../mod/mod/muteRemove.js`),
  },
  roleAdd: {
   reload: async () => {
    self.mod.roleAdd.file = await import(`../../../mod/mod/roleAdd.js?version=${Date.now()}`);
   },
   file: await import(`../../../mod/mod/roleAdd.js`),
  },
  roleRemove: {
   reload: async () => {
    self.mod.roleRemove.file = await import(`../../../mod/mod/roleRemove.js?version=${Date.now()}`);
   },
   file: await import(`../../../mod/mod/roleRemove.js`),
  },
  softBanAdd: {
   reload: async () => {
    self.mod.softBanAdd.file = await import(`../../../mod/mod/softBanAdd.js?version=${Date.now()}`);
   },
   file: await import(`../../../mod/mod/softBanAdd.js`),
  },
  softWarnAdd: {
   reload: async () => {
    self.mod.softWarnAdd.file = await import(
     `../../../mod/mod/softWarnAdd.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../mod/mod/softWarnAdd.js`),
  },
  strikeAdd: {
   reload: async () => {
    self.mod.strikeAdd.file = await import(`../../../mod/mod/strikeAdd.js?version=${Date.now()}`);
   },
   file: await import(`../../../mod/mod/strikeAdd.js`),
  },
  tempBanAdd: {
   reload: async () => {
    self.mod.tempBanAdd.file = await import(`../../../mod/mod/tempBanAdd.js?version=${Date.now()}`);
   },
   file: await import(`../../../mod/mod/tempBanAdd.js`),
  },
  tempChannelBanAdd: {
   reload: async () => {
    self.mod.tempChannelBanAdd.file = await import(
     `../../../mod/mod/tempChannelBanAdd.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../mod/mod/tempChannelBanAdd.js`),
  },
  tempMuteAdd: {
   reload: async () => {
    self.mod.tempMuteAdd.file = await import(
     `../../../mod/mod/tempMuteAdd.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../mod/mod/tempMuteAdd.js`),
  },
  unAfk: {
   reload: async () => {
    self.mod.unAfk.file = await import(`../../../mod/mod/unAfk.js?version=${Date.now()}`);
   },
   file: await import(`../../../mod/mod/unAfk.js`),
  },
  warnAdd: {
   reload: async () => {
    self.mod.warnAdd.file = await import(`../../../mod/mod/warnAdd.js?version=${Date.now()}`);
   },
   file: await import(`../../../mod/mod/warnAdd.js`),
  },
 },
 actionAlreadyApplied: {
  reload: async () => {
   self.actionAlreadyApplied.file = await import(
    `../../../mod/actionAlreadyApplied.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../mod/actionAlreadyApplied.js`),
 },
 alreadyExecuting: {
  reload: async () => {
   self.alreadyExecuting.file = await import(
    `../../../mod/alreadyExecuting.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../mod/alreadyExecuting.js`),
 },
 checkExeCanManage: {
  reload: async () => {
   self.checkExeCanManage.file = await import(
    `../../../mod/checkExeCanManage.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../mod/checkExeCanManage.js`),
 },
 err: {
  reload: async () => {
   self.err.file = await import(`../../../mod/err.js?version=${Date.now()}`);
  },
  file: await import(`../../../mod/err.js`),
 },
 getMembers: {
  reload: async () => {
   self.getMembers.file = await import(`../../../mod/getMembers.js?version=${Date.now()}`);
  },
  file: await import(`../../../mod/getMembers.js`),
 },
 getStrike: {
  reload: async () => {
   self.getStrike.file = await import(`../../../mod/getStrike.js?version=${Date.now()}`);
  },
  file: await import(`../../../mod/getStrike.js`),
 },
 isMe: {
  reload: async () => {
   self.isMe.file = await import(`../../../mod/isMe.js?version=${Date.now()}`);
  },
  file: await import(`../../../mod/isMe.js`),
 },
 isSelf: {
  reload: async () => {
   self.isSelf.file = await import(`../../../mod/isSelf.js?version=${Date.now()}`);
  },
  file: await import(`../../../mod/isSelf.js`),
 },
 notifyTarget: {
  reload: async () => {
   self.notifyTarget.file = await import(`../../../mod/notifyTarget.js?version=${Date.now()}`);
  },
  file: await import(`../../../mod/notifyTarget.js`),
 },
 permissionError: {
  reload: async () => {
   self.permissionError.file = await import(
    `../../../mod/permissionError.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../mod/permissionError.js`),
 },
 startLoading: {
  reload: async () => {
   self.startLoading.file = await import(`../../../mod/startLoading.js?version=${Date.now()}`);
  },
  file: await import(`../../../mod/startLoading.js`),
 },
 db: {
  reload: async () => {
   self.db.file = await import(`../../../mod/db.js?version=${Date.now()}`);
  },
  file: await import(`../../../mod/db.js`),
 },
 declareSuccess: {
  reload: async () => {
   self.declareSuccess.file = await import(`../../../mod/declareSuccess.js?version=${Date.now()}`);
  },
  file: await import(`../../../mod/declareSuccess.js`),
 },
};

export default self;
