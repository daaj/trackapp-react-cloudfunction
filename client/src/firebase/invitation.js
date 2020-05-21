import * as firebase from 'firebase'

export const setInvitation = (from, to, noteid, role) => {
    firebase.database().ref(`/invitations`).push({
        from,
        to,
        noteid,
        role,
    })
}