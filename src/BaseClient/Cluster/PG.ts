import { BaseMessage } from 'discord-hybrid-sharding';
import PG from 'pg';
import type * as Typings from '../../Typings/Typings.js';
import ConnectionString from 'pg-connection-string';
import { APIInteraction } from 'discord.js';
import Manager from './Manager.js';

const Client = new PG.Client(
 ConnectionString.parse(process.env.DATABASE_URL ?? '') as PG.ClientConfig,
);
Client.connect();

try {
 await Client.query('SELECT $1::text as message', ['Hello world!']);
 console.log(`| Subscription service online`);
} catch (err) {
 console.error(err);
}

await Client.query('LISTEN interaction;');
await Client.query('LISTEN vote;');
await Client.query('LISTEN appeal;');

// related to /BaseClient/UtilModules/getEvents.ts
enum MessageType {
 Appeal = 'appeal',
 Vote = 'vote',
 Interaction = 'interaction',
}

export interface AppealMessage extends BaseMessage {
 type: MessageType.Appeal;
 appeal: Typings.Appeal;
}

export interface VoteMessage extends BaseMessage {
 type: MessageType.Vote;
 vote: Typings.TopGGGuildVote | Typings.TopGGBotVote;
}

export interface InteractionMessage extends BaseMessage {
 type: MessageType.Interaction;
 interaction: APIInteraction;
}

export type PGMessage = VoteMessage | AppealMessage | InteractionMessage;

Client.on('notification', (msg) => {
 switch (msg.channel as MessageType) {
  case MessageType.Appeal: {
   const payload = JSON.parse(msg.payload as string);
   Manager.broadcast(new BaseMessage({ appeal: payload, type: MessageType.Appeal }));
   break;
  }
  case MessageType.Interaction: {
   const payload = JSON.parse(msg.payload as string);
   Manager.broadcast(new BaseMessage({ interaction: payload, type: MessageType.Interaction }));
   break;
  }
  case MessageType.Vote: {
   const payload = JSON.parse(msg.payload as string);
   Manager.broadcast(new BaseMessage({ vote: payload, type: MessageType.Vote }));
   break;
  }
  default:
   throw new Error(`Received unknown notification on channel ${msg.channel}: ${msg.payload}`);
 }
});
