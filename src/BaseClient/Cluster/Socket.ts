import * as Discord from 'discord.js';
import { BaseMessage } from 'discord-hybrid-sharding';
import io from 'socket.io-client';
import type * as Typings from '../../Typings/Typings.js';
import Manager from './Manager.js';

const Socket = io('https://api.ayakobot.com', {
 transports: ['websocket'],
 auth: {
  reason: 'botClient',
  code: process.env.socketToken ?? '',
 },
});

export enum MessageType {
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
 interaction: Discord.APIInteraction;
}

export type SocketMessage = VoteMessage | AppealMessage | InteractionMessage;

Socket.on(MessageType.Vote, async (vote: Typings.TopGGBotVote | Typings.TopGGGuildVote) => {
 Manager.broadcast(new BaseMessage({ vote, type: MessageType.Vote }));
});

Socket.on(MessageType.Appeal, (appeal: Typings.Appeal) => {
 Manager.broadcast(new BaseMessage({ appeal, type: MessageType.Appeal }));
});

Socket.on(MessageType.Interaction, (interaction: Discord.APIInteraction) => {
 Manager.broadcast(new BaseMessage({ interaction, type: MessageType.Interaction }));
});
