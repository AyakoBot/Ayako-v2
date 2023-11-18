import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.embedbuilder.create,
 placeholder2: t.stp(t.JSON.slashCommands.rp.notice, {
  t,
 }),
 start: {
  ...t.JSON.slashCommands.embedbuilder.create.start,
  'field-nr': t.stp(t.JSON.slashCommands.embedbuilder.create.start['field-nr'], { t }),
 },
 author: t.stp(t.JSON.slashCommands.embedbuilder.create.author, { t }),
 fields: (cmdId: string) => [
  t.JSON.slashCommands.embedbuilder.create.fields[0],
  t.JSON.slashCommands.embedbuilder.create.fields[1],
  t.stp(t.JSON.slashCommands.embedbuilder.create.fields[2], { cmdId }),
 ],
});
