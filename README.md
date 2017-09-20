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
- dead simple [reducer composition](https://github.com/flintinatux/puddles/blob/master/docs/API.md#pcombine)
- pure view functions in [plain javascript](https://github.com/flintinatux/puddles/blob/master/docs/API.md#p)
- hash-based [client-side routing](https://github.com/flintinatux/puddles/blob/master/docs/API.md#proute)
- native support for [asynchronous actions](https://github.com/flintinatux/puddles/blob/master/docs/API.md#paction)
- [automatically dispatched](https://github.com/flintinatux/puddles/blob/master/docs/API.md#pmount) user actions
- integration with the [Redux DevTools extension](https://github.com/flintinatux/puddles/blob/master/docs/API.md#pdevtools)

To whet your appetite, try the obligatory Hello World example:

```js
const compose = require('ramda/src/compose')
const merge   = require('ramda/src/merge')
const p       = require('puddles')
const path    = require('ramda/src/path')

const init = { name: 'world' }

const reducer = p.handle(init, {
  SET_NAME: (state, name) => merge(state, { name })
})

const setName = p.action('SET_NAME')

const targetVal = path(['target', 'value'])

const view = state =>
  p('div#root', [
    p('div.greeting', `Hello ${state.name}!`),

    p('input.name', {
      attrs: { placeholder: 'Enter name...' },
      on: { input: compose(setName, targetVal) },
      props: { value: state.name }
    })
  ])

const root = document.body.querySelector('#root')

p.mount(root, view, reducer)
```

Notice anything missing?  There is no `dispatch` function!  The `setName` action creator attached to the `input` event is composed with the `dispatch` function internally.

Impressed?  Read the [full documentation](https://github.com/flintinatux/puddles/blob/master/docs/API.md) to learn more.
