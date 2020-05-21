import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import auth from './auth'
import notes from './note'

export default combineReducers({
    auth,
    notes,
    routing: routerReducer
})