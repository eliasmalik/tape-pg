'use strict';

var tape = require('tape');
var tape_pg = require('../index.js');
var pg = require('pg');

var connection = {
  host: 'localhost',
  port: 5432,
  database: 'tape_test',
};

var model = `
  BEGIN;
  DROP TABLE IF EXISTS testtable CASCADE;

  CREATE TABLE testtable (
    id BIGINT NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    deets jsonb
  )
  WITHOUT OIDS;
`;

var pgtest = tape_pg({ pg, connection, model }, tape);

pgtest('have been passed client', (t, client) => {
  t.ok(client instanceof pg.Client);
  t.end();
});

pgtest('select should be empty', (t, client) => {
  client.query('SELECT * FROM testtable', (err, result) => {
    t.notOk(err, 'No error');
    t.equal(result.rowCount, 0, 'No results');
    t.end();
  });
});

pgtest('insert should work', (t, client) => {
  client.query(
    'INSERT INTO testtable (id, name, deets) VALUES ($1, $2, $3) RETURNING *',
    [0, 'dave', '{}'],
    (err, result) => {
      t.notOk(err, 'No error');
      t.equal(result.rowCount, 1, 'Row inserted');
      t.equal(result.rows[0].id, '0');
      t.equal(result.rows[0].name, 'dave');
      t.deepEqual(result.rows[0].deets, {});
      t.end();
    }
  );
});

pgtest('should not keep record from previous test', (t, client) => {
  client.query('SELECT * FROM testtable', (err, result) => {
    t.notOk(err, 'No error');
    t.equal(result.rowCount, 0, 'No results');
    t.end();
  });
});

pgtest('can pass expected number of assertions', 1, (t, client) => {
  client.query('', (err, result) => {
    t.equal(result.rowCount, null, 'No query');
  });
});

pgtest.onFinish(() => {
  console.log('ONFINISH!!');
});
