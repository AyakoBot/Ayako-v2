/* eslint-disable no-console */
import pg from 'pg';
import auth from '../auth.json' assert { type: 'json' };

const DataBase = new pg.Pool({
 user: 'postgres',
 host: 'localhost',
 database: 'Clone_DB',
 password: auth.pSQLpw,
 port: 5432,
});

// eslint-disable-next-line no-console
const { log } = console;

DataBase.query('SELECT NOW() as now;', (err) => {
 if (err) {
  log("| Couldn't connect to DataBase", err.stack);
 } else {
  log('| Established Connection to DataBase');
 }
});

DataBase.connect((err) => {
 if (err) log('Error while logging into DataBase', err.stack);
});

DataBase.on('error', (err) => {
 log('Unexpected error on idle pool client', err);
});

export default DataBase;
