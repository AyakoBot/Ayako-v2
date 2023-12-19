import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories.basic,
 tokenSetDesc: t.stp(t.JSON.slashCommands.settings.categories.basic.tokenSetDesc, {
  t,
 }),
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
  token: {
   name: t.JSON.slashCommands.settings.categories.basic.fields.token.name,
   desc: t.stp(t.JSON.slashCommands.settings.categories.basic.fields.token.desc, { t }),
  },
 },
});
