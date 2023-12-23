import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.embedbuilder.create,
 start: {
  ...t.JSON.slashCommands.embedbuilder.create.start,
  'field-nr': (fieldNr: number) =>
   t.stp(t.JSON.slashCommands.embedbuilder.create.start['field-nr'], { fieldNr, t }),
 },
 author: t.stp(t.JSON.slashCommands.embedbuilder.create.author, { t }),
 fields: (cmdId: string) => [
  t.JSON.slashCommands.embedbuilder.create.fields[0],
  t.JSON.slashCommands.embedbuilder.create.fields[1],
  t.stp(t.JSON.slashCommands.embedbuilder.create.fields[2], { cmdId }),
 ],
});
