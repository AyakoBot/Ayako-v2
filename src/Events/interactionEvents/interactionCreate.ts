import type * as Discord from 'discord.js';
import commandHandler from './commandHandler.js';
import buttonHandler from './buttonHandler.js';
import modalHandler from './modalHandler.js';
import contextCommandHandler from './contextCommandHandler.js';
import selectHandler from './selectHandler.js';

export default async (cmd: Discord.Interaction) => {
  commandHandler(cmd);
  buttonHandler(cmd);
  modalHandler(cmd);
  contextCommandHandler(cmd);
  selectHandler(cmd);
};
