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

DataBase.query('SELECT NOW() as now;', (err) => {
 if (err) {
  console.log("| Couldn't connect to DataBase", err.stack);
 } else {
  console.log('| Established Connection to DataBase');
 }
});

DataBase.connect((err) => {
 if (err) console.log('Error while logging into DataBase', err.stack);
});

DataBase.on('error', (err) => {
 console.log('Unexpected error on idle pool client', err);
});

export default DataBase;
