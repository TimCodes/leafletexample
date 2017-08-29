'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('graphics service', function() {
  it('registered the graphics service', () => {
    assert.ok(app.service('graphics'));
  });
});
