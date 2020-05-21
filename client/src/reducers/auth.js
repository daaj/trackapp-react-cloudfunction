import * as Types from '../constants/actionType'
// import { REHYDRATE } from 'redux-persist/constants'

const initialState = {
    isLoggedIn: false,
    uid: null,
    email: null,
}

const auth_reducer = (state = initialState, action) => {
    switch(action.type){
        // case REHYDRATE:
        //     var incoming = action.payload.myReducer
        //     if (incoming) return {...state, ...incoming}
        //     return state

        case Types.LOGIN_SUCCESS:
            return Object.assign({}, state, { isLoggedIn: true,
                uid: action.data.uid,
                email: action.data.email,
                displayName: action.data.displayName,
                photoURL: action.data.photoURL,
            })

        case Types.LOGIN_FAIL:
            return state

        case Types.LOGOUT_SUCCESS:
            return Object.assign({}, initialState)

        case Types.LOGOUT_FAIL:
            return state

        case Types.SIGNUP_SUCCESS:
            return Object.assign({}, state, { isLoggedIn: true,
                uid: action.data.uid,
                email: action.data.email,
                displayName: action.data.displayName,
                photoURL: action.data.photoURL,
            })

        case Types.SIGNUP_FAIL:
            return state
        
        case Types.GET_USER:
            console.log('GET_USER')
            return Object.assign({}, state, { firstName: action.firstName, lastName: action.lastName, email: action.email})
        case Types.SIGNUP_TYPE:
            console.log('SIGNUP_TYPE')
            return Object.assign({}, state, { type: action.signUpType })
        case Types.EDIT_TYPE:
            console.log('EDIT_TYPE', action.flag)        
            return Object.assign({}, state, { isEditable: action.flag })
        default:
            return state
    }   
}

export default auth_reducer