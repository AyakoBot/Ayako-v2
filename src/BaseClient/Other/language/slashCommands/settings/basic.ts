import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories.basic,
 fields: {
  ...t.JSON.slashCommands.settings.categories.basic.fields,
  prefix: {
   ...t.JSON.slashCommands.settings.categories.basic.fields.prefix,
   desc: t.stp(t.JSON.slashCommands.settings.categories.basic.fields.prefix.desc, { t }),
  },
  lan: {
   name: t.JSON.slashCommands.settings.categories.basic.fields.lan.name,
   desc: t.stp(t.JSON.slashCommands.settings.categories.basic.fields.lan.desc, { t }),
  },
 },
});
