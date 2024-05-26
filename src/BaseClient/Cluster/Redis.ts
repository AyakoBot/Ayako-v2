import Redis from 'redis';
import { BaseMessage } from 'discord-hybrid-sharding';
import { APIInteraction } from 'discord.js';
import type * as Typings from '../../Typings/Typings.js';
import Manager from './Manager.js';

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

export type Message = VoteMessage | AppealMessage | InteractionMessage;

const client = await Redis.createClient().duplicate().connect();

client.subscribe(MessageType.Vote, (message) => {
 const parse1 = JSON.parse(message);
 const data = (typeof parse1 === 'string' ? JSON.parse(parse1) : parse1) as VoteMessage['vote'];

 Manager.broadcast(new BaseMessage({ vote: data, type: MessageType.Vote }));
});

client.subscribe(MessageType.Interaction, (message) => {
 const parse1 = JSON.parse(message);
 const data = (
  typeof parse1 === 'string' ? JSON.parse(parse1) : parse1
 ) as InteractionMessage['interaction'];

 Manager.broadcast(new BaseMessage({ interaction: data, type: MessageType.Interaction }));
});

client.subscribe(MessageType.Appeal, (message) => {
 const parse1 = JSON.parse(message);
 const data = (typeof parse1 === 'string' ? JSON.parse(parse1) : parse1) as AppealMessage['appeal'];

 Manager.broadcast(new BaseMessage({ appeal: data, type: MessageType.Appeal }));
});

export default client;