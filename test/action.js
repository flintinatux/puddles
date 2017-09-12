const { expect } = require('chai')

const action = require('../lib/action')

describe('p.action', function() {
  const type    = 'TYPE'
  const payload = 'payload'

  describe('when supplied with a type and payload', function() {
    const a = action(type, payload)

    it('creates an FSA-style action', function() {
      expect(a.type).to.equal(type)
      expect(a.payload).to.equal(payload)
    })
  })

  describe('when supplied with just a type', function() {
    const creator = action(type)

    it('curries to form an action creator', function() {
      expect(creator).to.be.a('function')
      const a = creator(payload)
      expect(a.type).to.equal(type)
      expect(a.payload).to.equal(payload)
    })
  })
})
