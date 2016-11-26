/*
 * Decorator functions to provide extra functionality to the tape test object
 */
'use strict';


/**
 * Provides postgres connection in each test. Disconnects client after test.
 * @param  {Object}    opts :: Options object to configure wrapper
 * @param  {tape.Test} tape :: The tape test function
 * @return {Function}       :: Test function w/ tape compatible API
 */
module.exports = function (opts, tape) {
  var pg = opts.pg || require('pg');
  var model = opts.model || '';
  var pool = new pg.Pool(opts.connection);
  var _client, _release;

  tape.onFinish(() => pool.end());

  function wrapper (name, expect, fn) {
    if (!fn) {
      fn = expect; // eslint-disable-line no-param-reassign
      expect = null; // eslint-disable-line no-param-reassign
    }

    tape(name + ' :: connect', (t) => {
      pool.connect((connErr, client, release) => {
        if (connErr) {
          t.fail(connErr);
          return t.end();
        }

        _client = client;
        _release = release;

        // Need to drop ?
        _client.query(model)
          .then(() => t.end())
          .catch((err) => {
            t.fail(err);
            t.end();
          });
      });
    });

    tape(name, (t) => {
      if (expect !== null)
        t.plan(expect);


      fn.call(t, t, _client);
    });

    tape(name + ' :: disconnect', (t) => {
      // Need to drop ?
      _release();
      t.end();
    });

  }

  wrapper.onFinish = tape.onFinish;

  return wrapper;
};
