require('raf').polyfill()
const Emitter   = require('events')
const { jsdom } = require('jsdom')
const URL       = require('url')

const emitter = new Emitter()
global.addEventListener = emitter.on.bind(emitter)
global.document = jsdom()

global.history = {
  pushState(state, title, href) {
    location.href = href
  }
}

global.location = {
  // get hash() {
  //   return this._hash || ''
  // },

  // set hash(x) {
  //   this._hash = x
  //   emitter.emit('hashchange')
  //   return x
  // },

  set href(href) {
    this._href = href
  },

  get pathname() {
    return URL.parse(this._href).pathname
  },

  get search() {
    return URL.parse(this._href).search
  }
}

afterEach(function() {
  emitter.removeAllListeners()
  global.location.href = ''
  document.body.innerHTML = ''
})
