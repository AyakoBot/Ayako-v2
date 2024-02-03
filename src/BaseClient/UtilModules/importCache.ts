import BaseClient from './importCache/BaseClient.js';
import Events from './importCache/Events.js';
import Typings from './importCache/Typings.js';
import pack from './importCache/package.js';
import Language from './importCache/Language.js';
import SlashCommandsIndex from './importCache/SlashCommands.js';

import AutocompleteCommands from './importCache/Commands/AutocompleteCommands.js';
import ButtonCommands from './importCache/Commands/ButtonCommands.js';
import ContextCommands from './importCache/Commands/ContextCommands.js';
import ModalCommands from './importCache/Commands/ModalCommands.js';
import SelectCommands from './importCache/Commands/SelectCommands.js';
import SlashCommands from './importCache/Commands/SlashCommands.js';

export default {
 BaseClient,
 pack,
 Typings,
 Events,
 Language,
 SlashCommands: SlashCommandsIndex,
 Commands: {
  AutocompleteCommands,
  ButtonCommands,
  ContextCommands,
  ModalCommands,
  SelectCommands,
  SlashCommands,
 },
};
