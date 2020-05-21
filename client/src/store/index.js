import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import createHistory from 'history/createBrowserHistory'

import rootReducer from '../reducers'

export const history = createHistory()

const middleware = [
    thunk,
    routerMiddleware(history)
]

let composeEnhancers = compose
if (process.env.NODE_ENV === 'development') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}

const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(...middleware),
    autoRehydrate()
))

// begin periodically persisting the store
// persistStore(store)

export default store