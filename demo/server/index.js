require('pug/register')
const { compose, dissocPath } = require('ramda')
const http = require('http')
const { html, logger, methods, mount, routes, static } = require('paperplane')

const frontend = require('./frontend.pug')

const app = routes({
  '/dist/:path+': static({ root: 'dist' }),

  '/*': methods({
    GET: compose(html, frontend)
  })
})

const log = compose(logger, dissocPath(['req', 'headers']))

const opts = { errLogger: log, logger: log }

const server = http.createServer(mount(app, opts))

if (require.main === module) server.listen(3000, log)

module.exports = server
