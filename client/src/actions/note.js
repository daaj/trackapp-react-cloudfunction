import * as Type from '../constants/actionType'
import firebase from 'firebase'
import { push } from 'react-router-redux'

export const listenToRoles = (userid) => {
    return dispatch => {
        var rolesRef = firebase.database().ref(`/roles/users/${userid}/notes/`)

        rolesRef.on('child_added', function(childSnapshot, prevChildKey) {
            var noteid = childSnapshot.key
            var noteRef = firebase.database().ref(`/notes/${noteid}`)

            dispatch({
                type: Type.NOTE_ADD,
                noteid,
                data: {
                    ...childSnapshot.val(),
                }
            })
            
            noteRef.on('value', (snapshot) => {
                dispatch({
                    type: Type.NOTE_UPDATE,
                    noteid,
                    data: {
                        title: snapshot.val().title,
                    }
                })
            })
        })
        
        rolesRef.on('child_removed', function(oldChildSnapshot) {
            var noteid = oldChildSnapshot.key
            var noteRef = firebase.database().ref(`/notes/${noteid}`)

            dispatch({
                type: Type.NOTE_REMOVE,
                noteid,
            })

            noteRef.off('value')
        })
                
        rolesRef.on('child_changed', function(childSnapshot, prevChildKey) {
            var noteid = childSnapshot.key

            dispatch({
                type: Type.NOTE_UPDATE,
                noteid,
                data: {
                    ...childSnapshot.val(),
                }
            })
        })
    }
}