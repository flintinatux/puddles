const p = require('../..')

const { actions, reducers } = require('./ducks')

const root = document.body.querySelector('#root')

const routes = {
  '/':        require('./views/hello'),
  '/counter': require('./views/counter'),
  '/hello':   require('./views/hello'),
  '/:404+':   require('./views/not-found')
}

p.mount({ actions, reducers, root, routes })
