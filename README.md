<p align="center">
  <a href="#"><img src="https://cloud.githubusercontent.com/assets/888052/21037000/31cc30c0-bd98-11e6-9f9e-16faabfb1c25.png" alt="puddles" style="max-width:100%;"></a>
</p>
<p align="center">
  Tiny turnkey Redux vdom app framework.
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/puddles"><img src="https://img.shields.io/npm/v/puddles.svg" alt="npm version" style="max-width:100%;"></a> <a href="https://www.npmjs.com/package/puddles"><img src="https://img.shields.io/npm/dm/puddles.svg" alt="npm downloads" style="max-width:100%;"></a> <a href="https://travis-ci.org/flintinatux/puddles"><img src="https://travis-ci.org/flintinatux/puddles.svg?branch=master" alt="Build Status" style="max-width:100%;"></a>
</p>

## Introduction

The main goal of `puddles` is to make the [Redux](http://redux.js.org/) pattern easy, without all of the boilerplate.  If you like the Redux pattern, but wish you could code it in a more functional style, then `puddles` is for you.

With `puddles` you get all of these right out-of-the-box:

- curried [action creators](https://github.com/flintinatux/puddles/blob/master/docs/API.md#paction)
- switch-free [reducer construction](https://github.com/flintinatux/puddles/blob/master/docs/API.md#phandle)
- dead simple [reducer composition](https://github.com/flintinatux/puddles/blob/master/docs/API.md#pmount)
- pure view functions in [plain javascript](https://github.com/flintinatux/puddles/blob/master/docs/API.md#p)
- modern [client-side routing](https://github.com/flintinatux/puddles/blob/master/docs/API.md#proute) with `history.pushState`
- native support for [thunks](https://github.com/flintinatux/puddles/blob/master/docs/API.md#pmount)
- [automatically dispatched](https://github.com/flintinatux/puddles/blob/master/docs/API.md#pmount) user actions
- integration with the [Redux DevTools extension](https://github.com/flintinatux/puddles/blob/master/docs/API.md#pmount)

To whet your appetite, try the obligatory Hello World example:

```js
const { compose, constant, merge, path } = require('tinyfunk')
const p = require('puddles')

const actions = {
  reset:   constant(p.action('RESET', null)),
  setName: p.action('SET_NAME')
}

const reducers = {
  name: p.handle('world', {
    RESET:    constant('world'),
    SET_NAME: (state, name) => merge(state, { name })
  })
}

const targetVal = path(['target', 'value'])

const view = (actions, state) => {
  const { reset, setName } = actions
  const { name } = state

  return p('div#root', [
    p('div.greeting', `Hello ${name}!`),

    p('input.name', {
      attrs: { placeholder: 'Enter name...' },
      on: { input: compose(setName, targetVal) },
      props: { value: name }
    }),

    p('button.reset', { on: { click: reset } }, 'Reset')
  ])
}

const root = document.body.querySelector('#root')

p.mount(actions, reducers, root, view)
```

Notice anything missing?  There is no `dispatch` function!  The `setName` action creator attached to the `input` event is composed with the `dispatch` function internally.

Impressed?  Read the [full documentation](https://github.com/flintinatux/puddles/blob/master/docs/API.md) to learn more.
