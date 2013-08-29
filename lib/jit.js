#!/usr/bin/env node

/*
 * jit
 * https://github.com/sixFingers/jit
 *
 * Copyright (c) 2013 Ignazio Setti
 * Licensed under the MIT license.
 */

/**
 * Jit User Interface
 */

var program = require('commander');

program
  .version('0.0.1')
  .command('init', 'Create an empty git repository or reinitialize an existing one')
  .parse(process.argv);
