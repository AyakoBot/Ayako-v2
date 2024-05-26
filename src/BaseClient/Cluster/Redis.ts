import Redis from 'redis';
import { BaseMessage } from 'discord-hybrid-sharding';
import { APIInteraction } from 'discord.js';
import * as Typings from '../../Typings/Typings.js';
import Manager from './Manager.js';

// related to /BaseClient/UtilModules/getEvents.ts

export interface AppealMessage extends BaseMessage {
 type: Typings.MessageType.Appeal;
 appeal: Typings.Appeal;
}

export interface VoteMessage extends BaseMessage {
 type: Typings.MessageType.Vote;
 vote: Typings.TopGGGuildVote | Typings.TopGGBotVote;
}

export interface InteractionMessage extends BaseMessage {
 type: Typings.MessageType.Interaction;
 interaction: APIInteraction;
}

export type Message = VoteMessage | AppealMessage | InteractionMessage;

const client = await Redis.createClient().duplicate().connect();

client.subscribe(Typings.MessageType.Vote, (message) => {
 const parse1 = JSON.parse(message);
 const data = (typeof parse1 === 'string' ? JSON.parse(parse1) : parse1) as VoteMessage['vote'];

 Manager.broadcast(new BaseMessage({ vote: data, type: Typings.MessageType.Vote }));
});

client.subscribe(Typings.MessageType.Interaction, (message) => {
 const parse1 = JSON.parse(message);
 const data = (
  typeof parse1 === 'string' ? JSON.parse(parse1) : parse1
 ) as InteractionMessage['interaction'];

 Manager.broadcast(new BaseMessage({ interaction: data, type: Typings.MessageType.Interaction }));
});

client.subscribe(Typings.MessageType.Appeal, (message) => {
 const parse1 = JSON.parse(message);
 const data = (typeof parse1 === 'string' ? JSON.parse(parse1) : parse1) as AppealMessage['appeal'];

 Manager.broadcast(new BaseMessage({ appeal: data, type: Typings.MessageType.Appeal }));
});

export default client;
