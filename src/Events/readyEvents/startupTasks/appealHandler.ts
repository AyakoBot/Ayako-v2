import Socket from '../../../BaseClient/Socket.js';
import appealCreate from '../../appealEvents/apealCreate/appealCreate.js';

export default async () => {
 Socket.on('appeal', appealCreate);
};
