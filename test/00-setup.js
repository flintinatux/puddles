const { jsdom } = require('jsdom')
const spy       = require('@articulate/spy')
const URL       = require('url')

const DevTools = {
  connect: spy(),
  init:    spy(),
  send:    spy()
}

global.__REDUX_DEVTOOLS_EXTENSION__ = DevTools

global.document            = jsdom()
const window               = document.defaultView
global.addEventListener    = window.addEventListener.bind(window)
global.dispatchEvent       = window.dispatchEvent.bind(window)
global.removeEventListener = window.removeEventListener.bind(window)

global.history = {
  pushState(state, title, href) {
    location.href = href
  }
}

global.location = {
  host:   'localhost',
  href:   '/',
  origin: '',

  get pathname() {
    return URL.parse(this.href).pathname || '/'
  },

  get search() {
    return URL.parse(this.href).search || ''
  }
}

beforeEach(() =>
  location.href = '/'
)

afterEach(() => {
  DevTools.connect.reset()
  DevTools.init.reset()
  DevTools.send.reset()
})
