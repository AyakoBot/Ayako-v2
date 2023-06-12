/* eslint-disable no-console */
import DB from 'pg-x-redis';
import auth from '../auth.json' assert { type: 'json' };

const DataBase = new DB(
 {
  user: 'postgres',
  host: 'localhost',
  database: 'Clone_DB',
  password: auth.pSQLpw,
  port: 5432,
 },
 {
  name: 'AyakoDB',
  host: 'localhost',
 },
);

await DataBase.init();

export default DataBase;
