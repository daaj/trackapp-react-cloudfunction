const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

function setRole(uid, noteid, role) {
    if (!role) {
        return admin.database().ref(`/roles/users/${uid}/notes/${noteid}`).remove()
    } else {
        return admin.database().ref(`/roles/users/${uid}/notes/${noteid}`).set({
            role,
        })
    }
}

// admin.database().ref('/invitations').on('child_added', function(childSnapshot, prevChildKey){
//     const email = childSnapshot.val().to
//     const noteid = childSnapshot.val().noteid
//     const role = childSnapshot.val().role

//     const ref = admin.database().ref("/users")
//     const query = ref.orderByChild("email").equalTo(email)
//     query.on("child_added", function(snapshot) {
//         const userid = snapshot.key
//         console.log(userid)
//         admin.database().ref(`/roles/users/${userid}/notes/${noteid}`).set({
//             role,
//         }).then(() => {
//             admin.database().ref(`/invitations/${childSnapshot.key}`).remove()
//             query.off()
//         })
//     })
// })

exports.handleInvitation = functions.database.ref('/invitations').onWrite(event => {
    const previousVal = event.data.previous.val()
    const previousKeys = !previousVal ?  [] : Object.keys(previousVal)

    const val = event.data.val()
    const keys = !val ? [] : Object.keys(val)

    if ( previousKeys.length >= keys.length) return false

    const key = keys[keys.length - 1]
    const email = val[key].to
    const noteid = val[key].noteid
    const role = val[key].role

    const ref = admin.database().ref("/users")
    const query = ref.orderByChild("email").equalTo(email)
    return query.on("child_added", function(snapshot) {
        const userid = snapshot.key

        console.log(userid)
        setRole(userid, noteid, role).then(() => {
            admin.database().ref(`/invitations/${key}`).remove()
            query.off()
        })
    })
})

// admin.database().ref('/invitations').on('child_changed', function(childSnapshot, prevChildKey){
//     console.log(childSnapshot.val())
// })

exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {
    /* External API calling is possible in premium firebase account */
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey("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")
    // const msg = {
    //     to: 'user@test.com',
    //     from: 'test@test.com',
    //     subject: 'Welcome!',
    //     text: 'Thank you for using our app.',
    //     html: '<strong>Thank you for using our app.</strong>',
    // }
    // sgMail.send(msg)

    const user = event.data // The Firebase user.
    
    const uid = user.uid // The user id of the user.
    const email = user.email // The email of the user.
    console.log(user)
    // const displayName = user.displayName // The display name of the user.

    admin.database().ref(`/users/${event.data.uid}/`).set({
        // uid,
        email,
        // displayName,
    })

    const ref = admin.database().ref("/invitations")
    const query = ref.orderByChild("to").equalTo(email)
    return query.on("child_added", function(snapshot) {
        const noteid = snapshot.val().noteid
        const role = snapshot.val().role

        console.log(noteid)
        setRole(uid, noteid, role).then(() => {
            admin.database().ref(`/invitations/${snapshot.key}`).remove()
            query.off()
        })
    })
})

// exports.thumbnailProfile = functions.database.ref('/invitations/').onWrite(event => {
//     var eventSnapshot = event.data
//     eventSnapshot.forEach
//     var profilePictureSnapshot = eventSnapshot.child('profilePicture')
//     if (profilePictureSnapshot.changed()) {
//     return createThumbnail(profilePictureSnapshot.val())
//         .then(url => {
//         return eventSnapshot.ref.update({ profileThumbnail: url })
//         })
//     }
// })