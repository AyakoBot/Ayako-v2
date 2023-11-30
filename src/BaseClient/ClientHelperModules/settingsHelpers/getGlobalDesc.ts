import * as CT from '../../../Typings/CustomTypings.js';

// eslint-disable-next-line no-console
const { log } = console;

/**
 * Returns the description for a given type based on the provided language.
 * @param type - The type to get the description for.
 * @param language - The language object containing the descriptions.
 * @returns The description for the given type.
 */
export default (
 type: CT.BLWLType | 'autoModRule/channel' | 'autoModRule/channels' | 'autoModRule/roles',
 language: CT.Language,
) => {
 switch (type) {
  case 'blchannelid': {
   return language.slashCommands.settings.blchannel;
  }
  case 'blroleid': {
   return language.slashCommands.settings.blrole;
  }
  case 'bluserid': {
   return language.slashCommands.settings.bluser;
  }
  case 'wlchannelid': {
   return language.slashCommands.settings.wlchannel;
  }
  case 'wlroleid': {
   return language.slashCommands.settings.wlrole;
  }
  case 'wluserid': {
   return language.slashCommands.settings.wluser;
  }
  case 'autoModRule/channel': {
   return language.events.logs.automodRule.alertChannel;
  }
  case 'autoModRule/roles': {
   return language.events.logs.automodRule.exemptRoles;
  }
  case 'autoModRule/channels': {
   return language.events.logs.automodRule.exemptChannels;
  }
  default: {
   log(new Error(`Unknown Type ${type}`));
   return language.t.Unknown;
  }
 }
};
