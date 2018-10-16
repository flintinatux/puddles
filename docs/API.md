# API

The `puddles` api has a small surface-area by design, and was inspired by other excellent vdom libraries such as [mithril](http://mithril.js.org/), [hyperapp](https://github.com/hyperapp/hyperapp), and [snabbdom](https://github.com/paldepind/snabbdom), the latter of which provides the underlying vdom implementation and [hyperscript function](#p).

| Function | Signature | Description |
| -------- | --------- | ----------- |
| [`p`](#p) | `(String, Object, [Vnode]) -> Vnode` | hyperscript function |
| [`p.action`](#paction) | `String -> a -> Action` | curried action creator |
| [`p.error`](#perror) | `String -> Error -> Action` | curried error-action creator |
| [`p.handle`](#phandle) | `a -> { k: ((a, Action) -> a) } -> (a, Action) -> a` | multi-action reducer factory |
| [`p.mount`](#pmount) | `Object -> Object` | mounts an app into the DOM |

### p

```haskell
p :: (String, Object, [Vnode]) -> Vnode
```

#### Parameters

- String `selector` <br/>
  CSS selector defining element tag, class, and/or id.
- Object `data` <br/>
  (optional) Additional information for modules to access and manipulate the real DOM element when it is created.
- Array `children` <br/>
  (optional) List of child Vnodes.

#### Returns

- Vnode<br/>
  Learn more about the Vnode format [here](https://github.com/paldepind/snabbdom#virtual-node).

Use `p` to build a Vnode tree in your view functions.  The top-level view function will be passed `(actions, state)`, and should return a Vnode with children.

**Note:** The `p` hyperscript function is a direct export of `snabbdom/h`, so I recommend reading its own [comprehensive documentation](https://github.com/paldepind/snabbdom#snabbdomh).

See also [`p.mount`](#pmount).

```js
const { curry } = require('tinyfunk')
const p = require('puddles')

// An example view function for a single "Card"
const Card = curry((actions, card) => {
  const { select } = actions

  return p('div.card', {
    on: { click: [ select, card.id ] }
  }, [
    p('div.title', card.title)
  ])
})

// A higher-level view function that builds a list of "Cards"
const Cards = (actions, state) =>
  p('div.cards', state.cards.map(Card(actions)))
```

### p.action

```haskell
p.action :: String -> a -> Action
```

#### Parameters

- String `type` <br/>
  The action type, traditionally uppercase, but that is not enforced.
- any `payload` <br/>
  The action payload, can be any serializable value.

#### Returns

- Action <br/>
  An [FSA-compliant](https://github.com/acdlite/flux-standard-action) action with the format `{ type, payload }`.

See also [`p.error`](#perror), [`p.handle`](#phandle).

```js
const p = require('puddles')

p.action('TOGGLE', 42)
//=> { type: 'TOGGLE', payload: 42 }

const sendEmail = p.action('SEND_EMAIL')
sendEmail({ to: 'example@email.com' })
//=> { type: 'SEND_EMAIL', payload: { to: 'example@email.com' } }
```

### p.error

```haskell
p.error :: String -> Error -> Action
```

#### Parameters

- String `type` <br/>
  The action type, traditionally uppercase, but that is not enforced.
- Error `payload` <br/>
  An `Error` representing the failed action.

#### Returns

- Action <br/>
  An [FSA-compliant](https://github.com/acdlite/flux-standard-action) action representing an error, with the format `{ type, payload, error: true }`.

When an error-action is dispatched, the payload will be the supplied error, and the `error` flag will be `true`.

See also [`p.action`](#paction), [`p.handle`](#phandle).

```js
const p = require('puddles')

p.error('FETCH_USER', new Error('fetch failed'))
//=> { type: 'FETCH_USER', payload: Error(...), error: true }

const sendEmail = p.error('SEND_EMAIL')
sendEmail(new Error('mailbox full'))
//=> { type: 'SEND_EMAIL', payload: Error(...), error: true }
```

### p.handle

```haskell
p.handle :: a -> { k: ((a, Action) -> a) } -> (a, Action) -> a
```

#### Parameters

- any `init` <br/>
  Initial state, used if reducer is called with `undefined` state.
- Object `handlers` <br/>
  Map of action types to individual reducer functions with the signature `(state, payload)`.

#### Returns

- function <br/>
  A reducer that handles multiple action types.

Eliminates considerable boilerplate when creating reducers by avoiding verbose `switch` statements and by peeling open the `action.payload` for you.  Also safely passes back the previous state if an action `type` is not found in the `handlers`, as [recommended](http://redux.js.org/docs/basics/Reducers.html).

See also [`p.action`](#paction), [`p.error`](#perror).

```js
const { merge } = require('tinyfunk')
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

### p.mount

```haskell
p.mount :: Object -> Object
```

#### Options

Each of the options below is explained further in the [Getting started guide]().

| Options | Type | Default | Description |
| ------- | ---- | ------- | ----------- |
| [`actions`]() | `Object` | `{}` | deeply nested map of action creators |
| [`dev`]() | `Boolean` | `true` | enable/disable integration with Redux DevTools extension |
| [`middleware`]() | `Array` | `[]` | list of Redux middleware (`thunk` already included) |
| [`reducers`]() | `Object` | `{}` | map of namespaced reducers |
| [`root`]() | `Element` |  | root DOM element in which to mount the app |
| [`routes`]() | `Object` |  | map of route patterns to pure view functions |
| [`view`]() | `Function` |  | pure view function that maps application state to a Vnode tree |

**Note:**  The [`root`]() option is required, and you must also pass either a map of [`routes`]() or a single top-level [`view`]().  All other options have safe defaults.

#### Returns

- Object <br/>
  The Redux `store`, with `dispatch`, `getState`, and `teardown` functions.

Mounts your `puddles` app into the DOM and starts the Redux cycle.  Handles dispatching, routing, and redrawing for you.

The returned `store` has `dispatch` and `getState` functions that perform just like their traditional Redux counterparts.  The `store` also exposes a `teardown` function, which will:

- remove all elements inside the `root`,
- remove the `'popstate'` event listener for routing, and
- disable any further actions from being dispatched.

See also [`p`](#p).

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

const root = document.getElementById('root')

const { dispatch, teardown } = p.mount({ actions, reducers, root, view })

// One of my favorite tricks
const socket = require('socket.io-client')()
socket.on('action', dispatch)

// Later, if you want to destroy the app
teardown()
```
