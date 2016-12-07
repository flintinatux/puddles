const compose = require('crocks/funcs/compose')
const curry   = require('crocks/funcs/curry')

const Task = fork => {
  const bimap = (f, g) =>
    Task((rej, res) => fork(compose(rej, f), compose(res, g)))

  const chain = f =>
    Task((rej, res) => fork(rej, b => f(b).fork(rej, res)))

  const map = f =>
    Task((rej, res) => fork(rej, compose(res, f)))

  const toJSON = () =>
    `Task ${fork.name || 'anon'}`

  return { bimap, chain, fork, map, toJSON }
}

Task.depromisify = (f, ctx) =>
  (...args) => Task((rej, res) =>
    f.call(ctx, ...args).then(res).catch(rej))

Task.fork = curry((rej, res, task) => task.fork(rej, res))

Task.of = x =>
  Task((rej, res) => res(x))

Task.taskify = (f, ctx) =>
  (...args) => Task((rej, res) => {
    const cb = (err, val) => err ? rej(err) : res(val)
    f.call(ctx, ...args, cb)
  })

module.exports = Task
