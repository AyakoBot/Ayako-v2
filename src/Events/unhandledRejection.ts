/* eslint-disable no-console */
import auth from '../auth.json' assert { type: 'json' };
import client from '../BaseClient/Client.js';

export default (error: Error) => {
  if (client.user?.id !== auth.mainID) return;

  console.error(error);
};
