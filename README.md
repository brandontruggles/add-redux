add-redux [![license](https://img.shields.io/github/license/brandonrninefive/add-redux.svg?style=flat-square)](https://github.com/brandonrninefive/add-redux/blob/master/LICENSE.md) [![npm version](https://img.shields.io/npm/v/add-redux.svg?style=flat-square)](https://www.npmjs.com/package/add-redux) [![Build Status](https://img.shields.io/travis/brandonrninefive/add-redux.svg?style=flat-square)](https://travis-ci.org/brandonrninefive/add-redux) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/brandonrninefive/add-redux/issues)  
===

Quickly add Redux boilerplate files and directories to your vanilla JavaScript, React, or React Native app.

Want to contribute to this project, request a feature, or report a problem? Please open an issue [here](https://github.com/brandonrninefive/add-redux/issues).

Getting Started
---

You can install add-redux with the command:

`npm i -g add-redux`

Alternatively, you can use yarn like so:

`yarn global add add-redux`

You can then use add-redux on an existing project like so:

`add-redux <example_project_directory>`

Please note that this command assumes `npm init` or `yarn init` has already been run in the project directory, and that a `package.json` file exists within it. `add-redux` will throw an error if `package.json` is not present.

If a `yarn.lock` file is present in the project directory, `add-redux` will use yarn to install packages instead of npm.

Why is this Needed?
---

When creating a Redux-based project, there are currently many popular cli tools: [redux-wooo](https://github.com/kocisov/wooo), [create-react-app-with-redux](https://github.com/tstringer/create-react-app-with-redux), [create-react-redux-native-app](https://github.com/kMeillet/create-react-redux-native-app), [generator-create-redux-app](https://github.com/jonidelv/generator-create-redux-app), [create-redux-app](https://github.com/ReactPoland/create-redux-app), etc.

These tools are useful, but there are three main problems with them:

1. Many of them are bloated and include features that are often unnecessary for basic applications. 

2. Multiple commands are needed for different types of projects (i.e one is needed for regular React apps, while one is needed for React Native apps, and another is needed for vanilla JavaScript apps).

3. The commands themselves are often a bit long to type out.

`add-redux` aims to address these issues by providing a single, consice cli command for any type of Redux project, which sets up only the most barebones boilerplate code in order to avoid bloat.

What's Included?
---

Running `add-redux` on a project directory will add the following files and directories into the project directory:

```
├── reducers/ (only without the '--ducks' flag)
│   ├── index.js 
│   ├── sampleReducers.js
├── actions/ (only without the '--ducks' flag)
│   ├── index.js
├── store.js
├── redux_examples/ (optional with the '--examples' flag)
│   ├── <project examples> ...
├── ducks/ (optional with the '--ducks' flag)
│   ├── sampleDuck.js
```

From there, you can simply use `import store from 'store';` in your project to begin using Redux.

Any reducers should be created in the `reducers/` directory and imported into `index.js` to be merged with the other reducers.

Any actions should be created in the `actions/` directory.

`add-redux` will also save and configure the following middleware in your project by default:

- [redux-logger](https://github.com/evgenyrodionov/redux-logger)
- [redux-thunk](https://github.com/gaearon/redux-thunk) 
- [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)

If your project does not require any of these, see the option flags below. 


Options
---

When using `add-redux`, you can specify the following flags to control which packages are installed by the command and configured in the boilerplate code:

- `-r, --react` - Adds [react-redux](https://github.com/reactjs/react-redux) to the project dependencies. This feature currently leaves the rest of the React setup to the user, but it does prompt the user on how to do so.
- `-l, --no-logger` - Skips adding [redux-logger](https://github.com/evgenyrodionov/redux-logger) to the project dependencies and boilerplate code.
- `-t, --no-thunk` - Skips adding [redux-thunk](https://github.com/gaearon/redux-thunk) to the project dependencies and boilerplate code.
- `-p, --no-promise` - Skips adding [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware) to the project dependencies and boilerplate code.
- `-e, --examples` - Adds a `redux_examples/` directory to the project root. This directory includes examples for integrating redux with different types of projects.
- `-d, --ducks` - Adds a `ducks/` directory to the project root. This directory contains an example modular redux file (also known as a [duck](https://github.com/erikras/ducks-modular-redux)). Using this option will prevent the `actions/` and `reducers/` directories from being generated, since they are not needed by the [duck specification](https://github.com/erikras/ducks-modular-redux).
- `-s, --src [directory]` - Specifies the source directory for the project. This is where the boilerplate code will reside.        Defaults to the root project directory specified by the <path> argument.

Examples
---

The following example directories are generated within the `redux_examples/` directory when using the `--examples` flag.

- `react_example/` - An example project for integrating Redux with React. Includes a sample `App.js` file and a sample component which is used in `App.js`.
