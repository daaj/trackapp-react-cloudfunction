import * as firebase from 'firebase'
import store from '../store'

export const newRole = (userid, noteid, role) => {
    firebase.database().ref(`/roles/users/${userid}/notes/${noteid}`).set({
        role,
    })
}

export const checkRole = (userid, noteid) => {
    return firebase.database().ref(`/roles/users/${userid}/notes/${noteid}`).once('value').then(function(snapshot) {
        try {
            return snapshot.val().role
        } catch(error) {
            return null
        }
    })

    // try {
    //     return store.getState().role.roles[noteid].role === 'owner'
    // } catch(error) {
    //     return false
    // }
}