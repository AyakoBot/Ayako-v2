import client from '../../BaseClient/Bot/Client.js';
import { appeal } from '../../Commands/ButtonCommands/appeals/submit.js';
import * as CT from '../../Typings/Typings.js';

export default async ({ data }: CT.Message<CT.MessageType.Appeal>) =>
 appeal(client, Number(data.punishmentId));
