import React, { Component } from 'react'
import * as firebase from 'firebase'
import { push } from 'react-router-redux'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import Button from 'react-validation/build/button'
import { required, email } from '../validations'
import store from '../store'

import './signup.css'


class ResetPasswordForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            isSent: false,
        }
    }

    onChangeEmail(e) {
        this.setState({email: e.target.value})
    }

    sendResetPasswordEmail(e) {
        e.preventDefault()

        this.form.validateAll()
        firebase.auth().sendPasswordResetEmail(this.state.email)
        
        // store.dispatch(push('/login/'))
        this.setState({isSent: true})
    }

    render() {
        if (this.state.isSent) {
            return (
                <div className="login-container">
                    <div className="page-container" style={{minHeight:'901px'}}>
                        <div className="page-content">
                            <div className="content-wrapper">
                                <div className="content">
                                    <div className="panel panel-body login-form">
                                        <div className="text-center">
                                            <div className="icon-object border-warning text-warning"><i className="icon-spinner11"></i></div>
                                            <small className="display-block">We have sent you instructions via email</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="login-container">
                    <div className="page-container" style={{minHeight:'901px'}}>
                        <div className="page-content">
                            <div className="content-wrapper">
                                <div className="content">
                                    <Form ref={(r) => this.form = r}>
                                        <div className="panel panel-body login-form">
                                            <div className="text-center">
                                                {/* <div className="icon-object border-warning text-warning"><i className="icon-spinner11"></i></div> */}
                                                <h5 className="content-group">Password recovery <small className="display-block">We'll send you instructions in email</small></h5>
                                            </div>

                                            <div className="form-group has-feedback">
                                                <Input type="email" className="form-control custom-input" placeholder="Your email"
                                                    value={this.state.email}
                                                    onChange={this.onChangeEmail.bind(this)}
                                                    validations={[required, email]}
                                                />
                                                <div className="form-control-feedback">
                                                    <i className="icon-mail5 text-muted"></i>
                                                </div>
                                            </div>

                                            <Button type="submit" className="btn bg-blue btn-block" onClick={this.sendResetPasswordEmail.bind(this)}>
                                                Reset password
                                                {/* <i className="icon-arrow-right14 position-right"></i> */}
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default ResetPasswordForm