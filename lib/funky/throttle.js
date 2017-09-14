const delay = 1000/60

const raf = requestAnimationFrame || setTimeout

// throttle : (* -> a) -> * -> ()
const throttle = f => {
  let args
  let lock = false

  const exec = () => {
    f.apply(null, args)
    lock = false
  }

  const throttled = (...latest) => {
    args = latest
    if (!lock) {
      raf(exec, delay)
      lock = true
    }
  }

  return throttled
}

module.exports = throttle
