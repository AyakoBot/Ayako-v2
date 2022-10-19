import { EventEmitter } from 'node:events';

class ClientEmitter extends EventEmitter {
  decrementMaxListeners: () => void;
  incrementMaxListeners: () => void;

  constructor() {
    super();

    this.decrementMaxListeners = () => {
      const maxListeners = this.getMaxListeners();
      if (maxListeners !== 0) {
        this.setMaxListeners(maxListeners - 1);
      }
    };

    this.incrementMaxListeners = () => {
      const maxListeners = this.getMaxListeners();
      if (maxListeners !== 0) {
        this.setMaxListeners(maxListeners + 1);
      }
    };
  }
}

export default new ClientEmitter();
