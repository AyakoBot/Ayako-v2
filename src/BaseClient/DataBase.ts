import DataBaseClient from 'pg-x-redis';
import auth from '../auth.json' assert { type: 'json' };

const DataBase = new DataBaseClient(
  {
    user: 'postgres',
    host: 'localhost',
    database: 'Clone_DB',
    password: auth.pSQLpw,
    port: 5432,
  },
  {
    password: auth.redisToken,
    host: 'localhost',
    name: 'AyakoDB',
  },
);

await DataBase.init();

export default DataBase;
