import appealCreate from '../../appealEvents/apealCreate/appealCreate.js';
import Socket from '../../../BaseClient/Socket.js';

export default async () => {
 Socket.on('appeal', appealCreate);
};
