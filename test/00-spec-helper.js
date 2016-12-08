require('raf').polyfill()
const Emitter   = require('events')
const { jsdom } = require('jsdom')

const emitter = new Emitter()
global.addEventListener = emitter.on.bind(emitter)
global.document = jsdom()

global.location = {
  get hash() {
    return this._hash || ''
  },

  set hash(x) {
    this._hash = x
    emitter.emit('hashchange')
    return x
  }
}

afterEach(function () {
  emitter.removeAllListeners()
  global.location.hash = ''
});
