import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.integration,
 descCreateAudit: (integration: Discord.Integration, user: Discord.User) =>
  t.stp(t.JSON.events.logs.integration.descCreateAudit, {
   user: t.languageFunction.getUser(user),
   integration: t.languageFunction.getIntegration(integration),
  }),
 descCreate: (integration: Discord.Integration) =>
  t.stp(t.JSON.events.logs.integration.descCreate, {
   integration: t.languageFunction.getIntegration(integration),
  }),
 descDeleteIntegrationAudit: (
  user: Discord.User,
  integration: Discord.Integration,
  app: Discord.Application,
 ) =>
  t.stp(t.JSON.events.logs.integration.descDeleteIntegrationAudit, {
   user: t.languageFunction.getUser(user),
   integration: t.languageFunction.getIntegration(integration),
   app: t.languageFunction.getApplication(app),
  }),
 descDeleteAudit: (user: Discord.User, integration: Discord.Integration) =>
  t.stp(t.JSON.events.logs.integration.descDeleteAudit, {
   user: t.languageFunction.getUser(user),
   integration: t.languageFunction.getIntegration(integration),
  }),
 descDeleteIntegration: (integration: Discord.Integration) =>
  t.stp(t.JSON.events.logs.integration.descDeleteIntegration, {
   integration: t.languageFunction.getIntegration(integration),
  }),
 descUpdateAudit: (user: Discord.User, integration: Discord.Integration) =>
  t.stp(t.JSON.events.logs.integration.descUpdateAudit, {
   user: t.languageFunction.getUser(user),
   integration: t.languageFunction.getIntegration(integration),
  }),
 descUpdate: (integration: Discord.Integration) =>
  t.stp(t.JSON.events.logs.integration.descUpdate, {
   integration: t.languageFunction.getIntegration(integration),
  }),
 getAccount: (account: Discord.IntegrationAccount) =>
  t.stp(t.JSON.events.logs.integration.getAccount, {
   name: account.name,
   id: account.id,
  }),
 expireBehavior: {
  0: t.JSON.events.logs.integration.expireBehavior[0],
  1: t.JSON.events.logs.integration.expireBehavior[1],
 },
});
