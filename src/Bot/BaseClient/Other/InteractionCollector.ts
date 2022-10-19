import type DDeno from 'discordeno';
import { EventEmitter } from 'events';
import ClientEmitter from './ClientEmitter.js';

class InteractionCollector extends EventEmitter {
  ended: boolean;
  time: number;
  recieved: number;
  message: DDeno.Message;
  channel: DDeno.Channel;
  timeout: ReturnType<typeof setTimeout>;

  constructor(message: DDeno.Message, channel: DDeno.Channel, time?: number) {
    super();
    this.time = time || 60000;
    this.ended = false;
    this.recieved = 0;
    this.message = message;
    this.channel = channel;

    this.handleInteraction = this.handleInteraction.bind(this);
    this.handleMessageDeletion = this.handleMessageDeletion.bind(this);
    this.handleChannelDeletion = this.handleChannelDeletion.bind(this);
    this.handleThreadDeletion = this.handleThreadDeletion.bind(this);
    this.handleGuildDeletion = this.handleGuildDeletion.bind(this);

    this.timeout = setTimeout(() => this.stop('time'), this.time);

    ClientEmitter.on('interactionCreate', this.handleInteraction);
    ClientEmitter.on('messageDelete', this.handleMessageDeletion);
    ClientEmitter.on('channelDelete', this.handleChannelDeletion);
    ClientEmitter.on('threadDelete', this.handleThreadDeletion);
    ClientEmitter.on('guildDelete', this.handleGuildDeletion);

    this.once('end', () => {
      ClientEmitter.removeListener('interactionCreate', this.handleInteraction);
      ClientEmitter.removeListener('messageDelete', this.handleMessageDeletion);
      ClientEmitter.removeListener('channelDelete', this.handleChannelDeletion);
      ClientEmitter.removeListener('threadDelete', this.handleThreadDeletion);
      ClientEmitter.removeListener('guildDelete', this.handleGuildDeletion);
      ClientEmitter.decrementMaxListeners();
    });
  }

  handleChannelDeletion(channel: DDeno.Channel) {
    if (
      channel.id === this.message.channelId ||
      ('parentID' in this.channel && channel.id === this.channel.parentId)
    ) {
      this.stop('channelDelete');
    }
  }

  handleThreadDeletion(thread: DDeno.Channel) {
    if (thread.id === this.channel.id) {
      this.stop('threadDelete');
    }
  }

  handleGuildDeletion(guild: DDeno.Guild) {
    if ('guild' in this.channel && guild.id === this.channel.guildId) {
      this.stop('guildDelete');
    }
  }

  handleMessageDeletion(message: DDeno.Message) {
    if (message.id === this.message.id) {
      this.stop('messageDelete');
    }
  }

  handleInteraction(interaction: DDeno.Interaction) {
    if (interaction.type !== 3) return;
    if (interaction.message?.id === this.message.id) {
      this.emit('collect', interaction);
    }
  }

  stop(reason?: string) {
    if (this.ended) return;
    this.ended = true;
    this.emit('end', reason);
  }
}

export default InteractionCollector;
