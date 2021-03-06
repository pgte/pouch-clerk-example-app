import * as types from './constants/ActionTypes'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import PouchSyncTransactionsMiddleware from './middlewares/pouch-sync-transactions'
import PouchLoginMiddleware from './middlewares/pouch-login'
import EventEmitter from 'events'

const initialState = {
  session: {
    state: 'logged out',
    username: undefined,
  },
  transactions: [],
  syncState: {
    client: 'unknown',
    sync: 'unknown'
  },
  error: undefined
}

export default function configureStore() {
  const session = new EventEmitter()
  const middleware = applyMiddleware(
    thunk,
    PouchSyncTransactionsMiddleware(session),
    PouchLoginMiddleware(session))
  const createStoreWithMiddleware = middleware(createStore)
  return createStoreWithMiddleware(rootReducer, initialState)
}
