<p align="center">
  <a href="#"><img src="https://cloud.githubusercontent.com/assets/888052/21037000/31cc30c0-bd98-11e6-9f9e-16faabfb1c25.png" alt="puddles" style="max-width:100%;"></a>
</p>
<p align="center">
  Tiny redux-inspired vdom app framework.
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/puddles"><img src="https://img.shields.io/npm/v/puddles.svg" alt="npm version" style="max-width:100%;"></a> <a href="https://www.npmjs.com/package/puddles"><img src="https://img.shields.io/npm/dt/puddles.svg" alt="npm downloads" style="max-width:100%;"></a> <a href="https://travis-ci.org/flintinatux/puddles"><img src="https://travis-ci.org/flintinatux/puddles.svg?branch=master" alt="Build Status" style="max-width:100%;"></a>
</p>

## Usage

Install with:

    npm install --save puddles

Then require in your code with:

```js
const p = require('puddles')
```

## API

The `puddles` api has a small surface-area by design, and was inspired by other excellent vdom libraries such as [mithril](http://mithril.js.org/) and [snabbdom](https://github.com/paldepind/snabbdom), the latter of which provides the underlying vdom implementation and [hyperscript function](#pselector-data-children).

- [p](#p)                - hyperscript function
- [p.action](#paction)   - curried action creator
- [p.batch](#pbatch)     - batch multiple actions
- [p.combine](#pcombine) - reducer composer
- [p.handle](#phandle)   - multi-action reducer factory
- [p.href](#phref)       - `hashchange` route path helper
- [p.mount](#pmount)     - mounts a `puddles` app into the DOM
- [p.route](#proute)     - light-weight `hashchange` router

## p

```haskell
:: (String, Object, [Vnode]) -> Vnode
```

#### Parameters

- String `selector` <br/>
  CSS selector defining element tag, class, and/or id.
- Object `data` <br/>
  (optional) Additional information for modules to access and manipulate the real DOM element when it is created.
- Array `children` <br/>
  (optional) List of child vnodes.

#### Returns

- Vnode<br/>
  Learn more about the vnode format [here](https://github.com/paldepind/snabbdom#virtual-node).

The `p` hyperscript function is a direct export of `snabbdom/h`, so I recommend reading its own [comprehensive documentation](https://github.com/paldepind/snabbdom#snabbdomh).  However, I've made a couple important modifications to the modules used by the `snabbdom/patch` function, which are described [below]().

## p.action

```haskell
:: String -> a -> Object
```

#### Parameters

- string `type` <br/>
  The action type, traditionally uppercase, but that is not enforced.
- * `payload` <br/>
  The action payload, can be any serializable value, or a `thenable` or `forkable` monad.

#### Returns

- Object <br/>
  An [FSA-compliant](https://github.com/acdlite/flux-standard-action) action with the format `{ type, payload }`.

If the `payload` is a `thenable` or `forkable` monad, the dispatcher will first execute the async action defined by the payload, and then dispatch a new action of the same `type` with the resolved value.

**Note:** `p.action` is also curried, so making action-creators is painless.

```js
const p = require('puddles')

p.action('TOGGLE', 42)
//> { type: 'TOGGLE', payload: 42 }

const sendEmail = p.action('SEND_EMAIL')
sendEmail({ to: 'example@email.com' })
//> { type: 'SEND_EMAIL', payload: { to: 'example@email.com' } }
```

## p.batch

```haskell
:: [Object] -> Object
```

#### Parameters

- Array `actions` <br/>
  The array of actions to process in batch.

#### Returns

- Object `batchAction` <br/>
  A new action of type `puddles/actions/BATCH`, which will signal `dispatch` to process the supplied actions together.

Sometimes your event handlers need to dispatch multiple actions.  The naive solution is to use a [thunk](), and although `puddles` fully supports that, it can lead to ugly imperative code.  For example, you might have a "Change password" modal with a form and a few fields, like this:

```js
const assoc = require('ramda/src/assoc')
const flip  = require('ramda/src/flip')
const K     = require('ramda/src/always')
const p     = require('puddles')
const tap   = require('ramda/src/tap')

const prevent = tap(e => e.preventDefault())

const init = {
  confirm: '',
  password: ''
  show: true
}

const reducer = p.handle(init, {
  CONFIRM:  flip(assoc('confirm')),
  HIDE:     assoc('show', false),
  PASSWORD: flip(assoc('password')),
  SHOW:     assoc('show', true)
})

const confirm  = p.action('CONFIRM')
const hide     = K(p.action('HIDE', null))
const password = p.action('PASSWORD')
const show     = K(p.action('SHOW', null))

const view = state =>
  p('div.modal', { class: { show: state.show } }, [
    p('form', {
      on: { submit: compose(change(state.password), prevent) }
    }, [
      p('input', {
        on: { input: password },
        props: { value: state.password }
      }),

      p('input', {
        on: { input: confirm },
        props: { value: state.confirm }
      }),

      p('button', {
        attrs: { type: 'button' },
        on: { click: cancel }
      }, 'Cancel'),

      p('button', {
        attrs: {
          disabled: state.confirm === state.password,
          type: 'submit'
        }
      }, 'Save')
    ])
  ])
```

Implementing `cancel` as a `thunk` might look like this:

```js
const cancel = e => dispatch => {
  dispatch(password(''))
  dispatch(confirm(''))
  dispatch(hide())
}
```

Yuck!  Let's make that much cleaner with `p.batch` instead:

```js
const cancel = e => p.batch([ password(''), confirm(''), hide() ])
```

Much simpler, and no need to imperatively call `dispatch`.  The batched action will be unpacked during processing, and each action will be handled individually.

## p.combine

```haskell
:: Object -> (a, Object) -> a
```

#### Parameters

- Object `reducers` <br/>
  Map of top-level state object keys to child reducers.

#### Returns

- function <br/>
  New reducer that calls every child reducer, and gathers their results into a single state object.

The shape of the state object matches the keys of the passed `reducers`.  Especially useful for reducer composition, so you can breakup your state into domains, each with its own reducer.  And yes, this is exactly like the [combineReducers](http://redux.js.org/docs/api/combineReducers.html) function in `redux`, just written simpler and under a shorter name.

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

## p.handle

```haskell
:: (a, Object) -> (a, Object) -> a
```

#### Parameters

- * `init` <br/>
  Initial state, used if reducer is called with `undefined` state.
- Object `handlers` <br/>
  Map of action types to individual reducer functions with the signature `(state, payload)`.

#### Returns

- function <br/>
  A reducer that handles multiple action types.

Eliminates considerable boilerplate when creating reducers by avoiding verbose `switch` statements and by peeling open the `action.payload` for you.  Also safely passes back the previous state if an action `type` is not found in the `handlers`, as [recommended](http://redux.js.org/docs/basics/Reducers.html).

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

## p.href

```haskell
:: String -> String
```

#### Parameters

- String `path` <br/>
  Absolute target path.

#### Returns

- String `hashPath` <br/>
  Path prepended by the value of `p.route.prefix`.

The router created by `p.route` uses a routing strategy triggered by the `hashchange` event. This means that all of your links must have `href` attributes prefixed by the value of `p.route.prefix`, which defaults to `#!` (mostly for [tradition](https://webmasters.googleblog.com/2015/10/deprecating-our-ajax-crawling-scheme.html)).  Of course you could just always remember to prefix your own route links, but calling `p.href()` is sometimes simpler to remember.

```js
const p = require('puddles')

const view = state =>
  p('a.link', {
    attrs: { href: p.href('/status') }  //> '#!/status'
  }, 'Status')
```

## p.mount

```haskell
:: (Element, (a -> Vnode), ((a, Object) -> a)) -> Object
```

#### Parameters

- Element `root` <br/>
  Root element in which to mount the app.
- function `view` <br/>
  Pure view function that maps application state to a vnode tree.
- function `reducer` <br/>
  (optional) Reducer function that returns a new state based on an action. Defaults to [`identity`](http://devdocs.io/ramda/index#identity).

#### Returns

- Object <br/>
  An external interface object with `dispatch` and `state` [streams](https://github.com/paldepind/flyd#creating-streams), as well as a `teardown` function.

TODO: details

```js
const assoc   = require('ramda/src/assoc')
const compose = require('ramda/src/compose')
const flip    = require('ramda/src/flip')
const p       = require('puddles')
const path    = require('ramda/src/path')

const setName = p.action('SET_NAME')
const value   = path(['target', 'value'])

const init = { name: 'world' }

const reducer = p.handle(init, {
  SET_NAME: flip(assoc('name'))
})

const view = state =>
  p('div.example', [
    p('label', 'Name'),

    p('input', {
      on: { input: compose(setName, value) },
      props: { value: state.name }
    }),

    p('div.message', `Hello ${state.name}!`)
  ])

const root = document.getElementById('root')

p.mount(root, view, reducer)
```

## p.route

```haskell
:: (String, Object) -> a -> Vnode
```

#### Parameters

- String `initial` <br/>
  The route to redirect to if none exists (ie: `location.hash === ''`).
- Object `routes` <br/>
  Map of express-style route patterns to `view` functions.

#### Returns

- function <br/>
  A parent `view` function that renders the child view matching the current route.

TODO: details

```js
const p = require('puddles')

// these reducers are implemented elsewhere...
const user  = require('../ducks/user')
const users = require('../ducks/users')

const reducer = p.combine({ route: p.route.reducer, user, users })

const layout = content => state =>
  p('div.layout', [
    p('nav.header', [
      p('a.tab', {
        attrs: { href: p.href('/') }
      }, 'Home'),

      p('a.tab', {
        attrs: { href: p.href(`/profiles/${state.user.id}`) }
      }, 'My profile')
    ]),

    p('section.content', [ content(state) ])
  ])

const Home = state =>
  p('div.home', [
    p('h1.title', 'Home')
  ])

const Profile = state =>
  p('div.profile', [
    p('h1.title', `Profile for ${state.users[state.route.params.id].name}`)
  ])

const view = p.route('/', {
  '/':             layout(Home),
  '/profiles/:id': layout(Profile)
})

const root = document.getElementById('root')

p.mount(root, view, reducer)
```

In the example above, when the user first visits, the `layout(Home)` view will render, but after clicking on the `My profile` tab, this will be rendered:

```html
<div id='root'>
  <div id='router'>
    <div class='layout'>
      <nav class='header'>
        <a class='tab' href='#!/'>Home</a>
        <a class='tab' href='#!/profiles/123'>My profile</a>
      </nav>
      <section class='content'>
        <div class='profile'>
          <h1 class='title'>Profile for John Smith</h1>
        </div>
      </section>
    </div>
  </div>
</div>
```
