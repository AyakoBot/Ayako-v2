import embedBuilder from './ModalCommands/embed-builder.js';
import settings from './ModalCommands/settings.js';
import suggestion from './ModalCommands/suggestion.js';
import check from './ModalCommands/check.js';
import server from './ModalCommands/server.js';
import verify from './ModalCommands/verify.js';

const self = {
 'embed-builder': embedBuilder,
 settings,
 suggestion,
 check,
 server,
 verify,
};

export default self;
