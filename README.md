# tape-pg

Decorates the tape function to provide a `node-postgres` client in each test.

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
