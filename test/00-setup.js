require('raf').polyfill()
const { jsdom } = require('jsdom')
const URL       = require('url')

global.document = jsdom()

const window = document.defaultView
global.addEventListener    = window.addEventListener.bind(window)
global.dispatchEvent       = window.dispatchEvent.bind(window)
global.removeEventListener = window.removeEventListener.bind(window)

global.history = {
  pushState(state, title, href) {
    location.href = href
  }
}

global.location = {
  get href() {
    return this._href
  },

  set href(href) {
    return this._href = href
  },

  origin: '',

  get pathname() {
    return URL.parse(this._href).pathname || '/'
  },

  get search() {
    return URL.parse(this._href).search || ''
  }
}

beforeEach(function() {
  location.href = '/'
})
