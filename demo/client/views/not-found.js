const curry = require('ramda/src/curry')
const p     = require('../../..')

const Layout = require('./layout')

const NotFound = () =>
  p('h1', '404')

module.exports = Layout(curry(NotFound))
