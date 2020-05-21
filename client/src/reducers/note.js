import * as Types from '../constants/actionType'

const initialState = {}

const note_reducer = (state = initialState, action) => {
    let newState =  Object.assign({}, state)

    switch(action.type){
        case Types.NOTE_ADD:
            newState[action.noteid] = action.data
            return newState
            // return Object.assign({}, state, newState)
            // return {...state, ...newState}

        case Types.NOTE_REMOVE:
            delete newState[action.noteid]
            return newState
        
        case Types.NOTE_UPDATE:
            newState[action.noteid] = {
                ...newState[action.noteid],
                ...action.data
            }
            return newState

        case Types.NOTES_ALL_CLEAR:
            return initialState

        default:
            return state
            // return state
    }   
}

export default note_reducer