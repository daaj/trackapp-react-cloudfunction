import React from 'react'
import validator from 'validator'

export const required = (value) => {
    // console.log(value)
    if (!value.toString().trim().length) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return <span className="text-danger"> You can't leave this empty. </span>
    }
}
 
export const email = (value) => {
    if (!validator.isEmail(value)) {
        return <span className="text-danger"> {value} is not a valid email. </span>
    }
}
 
export const lt = (value, props) => {
    // get the maxLength from component's props
    if (!value.toString().trim().length > props.maxLength) {
        // Return jsx
        return <span className="text-danger">The value exceeded {props.maxLength} symbols.</span>
    }
}
 
export const password = (value, props) => {
    // get the maxLength from component's props
    if (value.length < props.minLength) {
        // Return jsx
        return <span className="text-danger">Try one with at least {props.minLength} characters.</span>
    }
}

export const confirm = (value, props, components) => {
    // NOTE: Tricky place. The 'value' argument is always current component's value.
    // So in case we're 'changing' let's say 'password' component - we'll compare it's value with 'confirm' value.
    // But if we're changing 'confirm' component - the condition will always be true
    // If we need to always compare own values - replace 'value' with components.password[0].value and make some magic with error rendering.
    if (value !== components['password'][0].value) { // components['password'][0].value !== components['confirm'][0].value
        // 'confirm' - name of input
        // components['confirm'] - array of same-name components because of checkboxes and radios
        return <span className="text-danger">These passwords don't match.</span>
    }
}

export const check_required = (value, props) => {
    if (!props.checked) {
        return <span className="text-danger hidden"> You can't leave this unchecked. </span>
    }
}