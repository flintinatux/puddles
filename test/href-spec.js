const { expect } = require('chai')

const href = require('../lib/href')
const { prefix } = require('../lib/route')

describe('p.href', function () {
  describe('when supplied with a path', function () {
    const path = href('/path')

    it('adds the route prefix', function () {
      expect(path).to.match(new RegExp(`^${prefix}`))
    });
  });
});
