const { expect } = require('chai')

const action = require('../lib/action')
const batch  = require('../lib/batch')

describe('p.batch', function () {
  const a  = action('type', 'payload')
        as = [ a, a ]

  describe('when supplied with an array of actions', function () {
    const b = batch(as)

    it('wraps them in a batch-type action', function () {
      expect(b.type).to.equal(batch.type)
      expect(b.payload).to.equal(as)
    });
  });

  describe('when supplied with a single action', function () {
    const b = batch(a)

    it('wraps it in a batch-type action', function () {
      expect(b.type).to.equal(batch.type)
      expect(b.payload).to.be.an('array')
      expect(b.payload[0]).to.equal(a)
    });
  });
});
