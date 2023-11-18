import * as ch from '../../../../ClientHelper.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories.basic,
 tokenSetDesc: t.stp(t.JSON.slashCommands.settings.categories.basic.tokenSetDesc, {
  t,
  invite: ch.constants.standard.invite.replace('%20applications.commands', ''),
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
