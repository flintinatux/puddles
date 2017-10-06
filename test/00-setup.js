const { jsdom } = require('jsdom')
const spy       = require('@articulate/spy')
const URL       = require('url')

global.__REDUX_DEVTOOLS_EXTENSION__ = {
  connect: spy(),
  init:    spy(),
  send:    spy()
}

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
  host: 'localhost',

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

beforeEach(() =>
  location.href = '/'
)

afterEach(() => {
  global.__REDUX_DEVTOOLS_EXTENSION__.connect.reset()
  global.__REDUX_DEVTOOLS_EXTENSION__.init.reset()
  global.__REDUX_DEVTOOLS_EXTENSION__.send.reset()
})
