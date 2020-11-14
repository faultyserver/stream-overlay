# Initial TypeScript React app

An app boilerplate for:

- React
- TypeScript
- PostCSS
- Webpack
- Babel
- ESLint
- Prettier
- asdf-vm (for installing node)
- Yarn

This also has a number of additional dependencies I often use:

- classnames
- query-string
- re-reselect
- react-helmet
- react-router-dom
- react-spring
- redux
- redux-thunk
- reselect

## Setup

1. Clone the repo
2. Copy `config/development.example.json` to `config/development.json`
3. `yarn`
4. `yarn serve`
5. Go to `localhost:8080` (or whatever host/port you configured in `development.json`) to see the app.


## Why not `create-react-app`?

I don't think a lot of the defaults that create-react-app uses are actually good:

- Requiring eslint, prettier, _and_ typescript to all pass for the app to load at all
- Hiding all dependencies in a nested dependency and then "ejecting"
- Not stripping types through babel-typescript.
- yarn
- A bit of tsconfig
- I can add common dependencies I use like `query-string` and such.
