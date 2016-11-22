const { expect } = require('chai')

const error = require('../lib/error')

describe('p.error', function () {
  const type = 'TYPE',
        err  = new Error('this is an error')

  describe('when supplied with a type and error', function () {
    const e = error(type, err)

    it('creates an FSA-style action representing an error', function () {
      expect(e.type).to.equal(type)
      expect(e.payload).to.equal(err)
      expect(e.error).to.be.true
    })
  })

  describe('when supplied with just a type', function () {
    const creator = error(type)

    it('curries to form an action creator', function () {
      expect(creator).to.be.a('function')
      const e = creator(err)
      expect(e.type).to.equal(type)
      expect(e.payload).to.equal(err)
      expect(e.error).to.be.true
    })
  })
})
