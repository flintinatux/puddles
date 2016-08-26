# puddles

Tiny redux app framework built on [snabbdom](https://github.com/paldepind/snabbdom).

## Usage

Install with:

    npm install --save puddles

Then require in your code with:

```js
const p = require('puddles')
```

## API

The `puddles` api is intentionally designed with a small footprint, and was inspired by other excellent vdom libraries such as [mithril](http://mithril.js.org/) and [snabbdom](https://github.com/paldepind/snabbdom), the latter on which it shamelessly depends for the underlying vdom implementation and [hyperscript function](#pselector-data-children).

## `p(selector, data, children)`

The `p` hyperscript function is a direct export of `snabbdom/h`, so I recommend reading its own [comprehensive documentation](https://github.com/paldepind/snabbdom#snabbdomh).  However, I've made a couple important modifications to the modules used by the `snabbdom/patch` function, which are described [below]().

## `p.action(type, payload)`

Returns a semi-[FSA-compliant](https://github.com/acdlite/flux-standard-action) action with the format `{ type, payload }`.  It is also curried, so making action-creators is painless.

### Example

```js
const p = require('puddles')

p.action('TOGGLE', 42)
//> { type: 'TOGGLE', payload: 42 }

const sendEmail = p.action('SEND_EMAIL')
sendEmail({ to: 'example@email.com' })
//> { type: 'SEND_EMAIL', payload: { to: 'example@email.com' } }
```

## `p.combine(reducers)`

Creates a new reducer that calls every child reducer, and gathers their results into a single state object. The shape of the state object matches the keys of the passed `reducers`.  Especially useful for reducer composition, so you can breakup your state into domains, each with its own reducer.  And yes, this is exactly like the [combineReducers](http://redux.js.org/docs/api/combineReducers.html) function in `redux`, just written simpler and under a shorter name.

### Example

```js
const merge = require('ramda/src/merge')
const p = require('puddles')

const counter = p.handle(0, {
  DEC: x => x - 1,
  INC: x => x + 1,
})

const pet = p.handle({ name: null }, {
  NAME: (state, name) => merge(state, { name })
})

const reducer = p.combine({ counter, pet })

reducer(undefined, {})
//> { counter: 0, pet: { name: null } }
```

## `p.handle(init, handlers)`

Creates a reducer that handles multiple action types.  Accepts an initial state `init`, and a `handlers` object mapping an action's `type` to individual reducer functions with the signature `(state, payload)`.  Eliminates considerable boilerplate when creating reducers by avoiding verbose `switch` statements and by peeling open the `action.payload` for you.  Also safely passes back the previous state if an action `type` is not found in the `handlers`, as [recommended](http://redux.js.org/docs/basics/Reducers.html).

### Example

```js
const merge = require('ramda/src/merge')
const p = require('puddles')

const init = { counter: 0, color: 'blue' }

const reducer = p.handle(init, {
  INCREMENT: (state, step)  => state.counter + step,
  COLORIZE:  (state, color) => merge(state, { color })
})

var state = reducer(undefined, {})
//> { counter: 0, color: 'blue' }

state = reducer(state, p.action('INCREMENT', 5))
//> { counter: 5, color: 'blue' }

state = reducer(state, p.action('COLORIZE', 'red'))
//> { counter: 5, color: 'red' }

state = reducer(state, p.action('NOT_HANDLED', null))
//> { counter: 5, color: 'red' }
```

## `p.mount(root, { reducer, view })`

TODO

## `p.route(initial, routes)`

TODO
