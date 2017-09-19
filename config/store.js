import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk'
import { API_SERVER } from '../config'

import {
  users,
  prompt,
  subjects,
  chapters,
  sections,
  exercises,
  officialexaminations,
  courses,
  examinationtypes,
  examinationdifficultys,
  examinations,
  yearexerciselists,
  answers,
  analysiss,
  yearexercisetypes,
  qiniu
} from '../ducks'
// 服务地址
// export const API_SERVER = 'localhost:3000'
let apolloClient = null

function _initClient (headers, initialState) {
  return new ApolloClient({
    initialState,
    ssrMode: !process.browser,
    dataIdFromObject: result => result.id || null,
    networkInterface: createNetworkInterface({
      uri: 'http://' + API_SERVER + '/graphql?',
      opts: {
        credentials: 'same-origin'
        // Pass headers here if your graphql server requires them
      }
    })
  })
}

export const initClient = (headers, initialState = {}) => {
  if (!process.browser) {
    return _initClient(headers, initialState)
  }
  if (!apolloClient) {
    apolloClient = _initClient(headers, initialState)
  }
  return apolloClient
}

// middleware
function createMiddleware (clientMiddleware) {
  if (process.browser && window.devToolsExtension) {
    return compose(
      applyMiddleware(thunk),
      autoRehydrate(),
      // If you are using the devToolsExtension, you can add it here also
      typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    )
  }
  return compose(applyMiddleware(thunk), autoRehydrate())
}

// reducer
function getReducer (client) {
  return combineReducers({
    // apollo: client.reducer(),
    users,
    prompt,
    subjects,
    chapters,
    sections,
    exercises,
    officialexaminations,
    courses,
    examinationtypes,
    examinationdifficultys,
    examinations,
    yearexerciselists,
    answers,
    analysiss,
    yearexercisetypes,
    qiniu
  })
}

// store
let reduxStore = null

export const initStore = (client, initialState) => {
  let store
  if (!process.browser || !reduxStore) {
    const middleware = createMiddleware(client.middleware())
    store = createStore(getReducer(client), initialState, middleware)
    if (!process.browser) {
      return store
    }
    reduxStore = store
  }
  return reduxStore
}

// persistStore(initStore(initClient(), {}), { storage: localforage, whitelist: ['departments', 'doctors', 'hospitals', 'users', 'patients'] })
