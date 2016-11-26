# [tape-pg](https://www.npmjs.com/package/tape-pg)

[![Build](https://img.shields.io/travis/eliascodes/tape-pg.svg)](https://travis-ci.org/eliascodes/tape-pg)
[![Coverage](https://codeclimate.com/github/eliascodes/tape-pg/badges/coverage.svg)](https://codeclimate.com/github/eliascodes/tape-pg/coverage)
[![npm](https://img.shields.io/npm/dt/tape-pg.svg)](https://www.npmjs.com/package/tape-pg)


Decorates the tape function to provide a `node-postgres` client in each test.

Also optionally runs SQL query before each test.

## Usage

```js
var tape = require('tape');
var tapePg = require('tape-pg');
var schema = require('./schema.sql');

var opts = {
  model: 'DROP TABLE IF EXISTS my_table; CREATE TABLE my_table (column VARCHAR NOT NULL);',
  connection: {
    host: 'localhost',
    port: 5432,
  }
};

var test = tapePg(opts, tape);

test('perform some query', (t, client) => {
  client.query('SELECT * FROM my_table', (err, result) => {
    t.end();
  });
});
```

## Unsupported `tape` features
The following `tape` features are currently unsupported:
* `.only`
* `.skip`
