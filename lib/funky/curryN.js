// curryN : Number -> (* -> a) -> (* -> a)
const _curryN = (n, f) =>
  n < 1 ? f : function curried(...args) {
    const left = n - args.length
    return left > 0
      ? _curryN(left, f.bind(null, ...args))
      : f.apply(null, args)
  }

module.exports = _curryN(2, _curryN)
