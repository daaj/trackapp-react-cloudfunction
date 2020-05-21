import * as Type from '../constants/actionType'
import firebase from 'firebase'
import { push } from 'react-router-redux'
import { listenToRoles } from './note'

export const emailSigninAsync = (email, password) => {
    return dispatch => {
        return firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
            dispatch({
                type: Type.LOGIN_SUCCESS,
                data: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }
            })
            dispatch(listenToRoles(user.uid))
        }).catch(function(error) {
            // var errorCode = error.code
            // var errorMessage = error.message
            // alert(errorMessage)
            dispatch({
                type: Type.LOGIN_FAIL,
                data: error
            })

            return new Promise((resolve, reject) => reject(error))
        })
    }
}

export const emailSignupAsync = (email, password, displayName, photoURL) => {
    return dispatch => {
        return firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
            return user.updateProfile({
                displayName,
                photoURL
            }).then(function() {
                user.sendEmailVerification().then(function() {
                    // Email sent.
                }).catch(function(error) {
                    // An error happened.
                });
                
                dispatch({
                    type: Type.SIGNUP_SUCCESS,
                    data: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    }
                })
                dispatch(listenToRoles(user.uid))

                return 'success'
            }).catch(function(error) {
                // An error happened.
                return new Promise((resolve, reject) => reject(error))
            })
        })
        .catch(function(error) {
            // Handle Errors here.
            // var errorCode = error.code
            // var errorMessage = error.message

            // console.log(error)
            dispatch({
                type: Type.SIGNUP_FAIL,
                data: error
            })

            return new Promise((resolve, reject) => reject(error))
        })
    }
}

export const googleSigninAsync = () => {
    return dispatch => {
        var provider = new firebase.auth.GoogleAuthProvider()
        // provider.addScope('https://www.googleapis.com/auth/plus.login')
        // firebase.auth().languageCode = 'pt'
        // provider.setCustomParameters({
        //   'login_hint': 'user@example.com'
        // })
        firebase.auth().signInWithRedirect(provider)
    }
}

export const facebookSigninAsync = () => {
    return dispatch => {
        var provider = new firebase.auth.FacebookAuthProvider()
        // provider.addScope('user_likes')
        // firebase.auth().languageCode = 'fr_FR'
        // provider.setCustomParameters({
        //   'display': 'popup'
        // })
        firebase.auth().signInWithRedirect(provider)
    }
}

export const getRedirectResultAsync = () => {
    return dispatch => {
        // The recommended way to get the current user is by setting an observer on the Auth object:
        // firebase.auth().onAuthStateChanged(function(user) {
        //     if (user) {
        //       browserHistory.push(`/users/${user.uid}`)
        //     } else {
        //       // No user is signed in.
        //     }
        // })

        // firebase.auth().signInWithRedirect(provider)
        // Then, you can also retrieve the Google provider's OAuth token by calling getRedirectResult when your PAGE LOADS:
        return firebase.auth().getRedirectResult().then(function(result) {
            if (result.credential) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken
                // ...
            }
            // The signed-in user info.
            var user = result.user
            dispatch({
                type: Type.LOGIN_SUCCESS,
                data: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }
            })
            dispatch(listenToRoles(user.uid))
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code
            var errorMessage = error.message
            // The email of the user's account used.
            var email = error.email
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential
            // ...
            dispatch({
                type: Type.LOGIN_FAIL,
                data: error
            })
        })
    }
}

export function logOut() {
    return (dispatch) => firebase.auth().signOut().then(function() {
        // Sign-out successful.
        dispatch({
            type: Type.LOGOUT_SUCCESS,
        })
        dispatch({
            type: Type.NOTES_ALL_CLEAR,
        })
    }).catch(function(error) {
        // An error happened.
        dispatch({
            type: Type.LOGOUT_FAIL,
            data: error
        })
    })
}