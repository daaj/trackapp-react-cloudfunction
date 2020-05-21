import * as firebase from 'firebase'
// import store from '../store'
// import * as Type from '../constants/actionType'

export const newNote = (noteid, title) => {
    firebase.database().ref(`/notes/${noteid}`).set({
        title,
    })

    // store.dispatch({
    //     type: Type.NOTE_UPDATE,
    //     noteid,
    //     data: {
    //         title
    //     }
    // })
}

export const setNoteTitle = (noteid, title) => {
    // firebase.database().ref(`/users/${userid}/notes/${noteid}`).set({
    firebase.database().ref(`/notes/${noteid}/title`).set(title)

    // store.dispatch({
    //     type: Type.NOTE_UPDATE,
    //     noteid,
    //     data: {
    //         title
    //     }
    // })
}

function jsonArrayToEmailKeyArray(arr) {
    let ret = []
    if(!!arr)
        arr.forEach((item) => {ret[item.email] = item.role})

    return ret
}

function emailKeyArrayToJsonArray(arr) {
    let ret = []
    Object.keys(arr).forEach((email) => ret.push({email, role:arr[email]}))

    return ret
}

export const setInvitedUserToNote = (noteid, email, role) => {
    const ref = firebase.database().ref(`/notes/${noteid}/invited`)

    return ref.once('value').then((snapshot) => {
        let invited = jsonArrayToEmailKeyArray(snapshot.val())
        invited[email] = role
        
        return ref.set(emailKeyArrayToJsonArray(invited))
    })
}

export const getInvitedUsers = (noteid) => { 
    const ref = firebase.database().ref(`/notes/${noteid}/invited`)
    
    return ref.once('value').then((snapshot) => {
        const invitedUsers = snapshot.val()
        return !invitedUsers ? [] : invitedUsers
    })
}

export const deleteInvitedUser = (noteid, email) => { 
    const ref = firebase.database().ref(`/notes/${noteid}/invited`)
    
    return ref.once('value').then((snapshot) => {
        let invited = jsonArrayToEmailKeyArray(snapshot.val())
        delete invited[email]
        
        return ref.set(emailKeyArrayToJsonArray(invited))
    })
}