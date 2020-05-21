import * as firebase from 'firebase'

export const getNoteDownloadURL = (noteid) => {
    // let ref = firebase.storage().ref(`/users/${userid}/notes/${noteid}/content`)
    let ref = firebase.storage().ref(`/notes/${noteid}/content`)
    return ref.getDownloadURL()
}

export const uploadImage = (noteid, file) => {
    const shortid = require('shortid')
    const imageid = shortid.generate()

    // let ref = firebase.storage().ref(`/users/${userid}/notes/${noteid}/images/${imageid}`)
    let ref = firebase.storage().ref(`/notes/${noteid}/images/${imageid}`)
    return ref.put(file)
}

export const saveNote = (noteid, content) => {
    // let ref = firebase.storage().ref(`/users/${userid}/notes/${noteid}/content`)
    let ref = firebase.storage().ref(`/notes/${noteid}/content`)
    ref.putString(content)
}