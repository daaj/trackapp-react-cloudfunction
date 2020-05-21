import React, { Component } from 'react'
import * as firebase from 'firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { emailSignupAsync } from '../actions/auth'

import { Checkbox, Radio } from 'react-icheck'
import 'icheck/skins/all.css' // or single skin css

import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import { required, email, password, confirm, lt, check_required } from '../validations'

import './signup.css'

import { form, control, button } from 'react-validation'
import Button from 'react-validation/build/button'


const _FirstLastNameInput = ({ error, isChanged, isUsed, className, valueOfFirstName, valueOfLastName, onFirstNameChange, onLastNameChange, ...props }) => (
    <div>
        <div className="col-md-6">
            <div className="form-group">
                <input name="first_name" {...props} className={(isChanged && isUsed && !!error ? 'is-invalid-input ':' ') + className} placeholder="First name" value={valueOfFirstName} onChange={onFirstNameChange} />
            </div>
        </div>
        <div className="col-md-6">
            <div className="form-group">
                <input name="last_name" {...props} className={(isChanged && isUsed && !!error ? 'is-invalid-input ':' ') + className} placeholder="Last name" value={valueOfLastName} onChange={onLastNameChange}/>
            </div>
        </div>
        <div className="col-md-12" style={{marginTop:'-20px', marginBottom:'20px'}}>
            {isChanged && isUsed && error}
        </div>
    </div>
)

const FirstLastNameInput = control(_FirstLastNameInput)


class SignupPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password : '',
            isTermCheck: false,
            error: null,
            searchResults : [],
        }

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this)
        this.handleLastNameChange = this.handleLastNameChange.bind(this)
        this.emailSignUp = this.emailSignUp.bind(this)
    }

    emailSignUp(event) {
        event.preventDefault()

        const {firstName, lastName, email, password} = this.state
        this.props.emailSignupAsync(email, password, firstName.trim() + ' ' + lastName.trim(), 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg')
        .catch(
            (error) => {
                this.setState({error})
            }
        )
    }

    handleFirstNameChange(event) {
        this.setState({firstName: event.target.value})      
    }

    handleLastNameChange(event) {
        this.setState({lastName: event.target.value})      
    }

    handleChangeEmail= (event) => {
        this.setState({email: event.target.value, error: null})
    } 

    handleChangePassword = (event) => {
        this.setState({password: event.target.value})
    } 

    onClickTermCheck = (event) => {
        this.setState((prevState) => ({isTermCheck: !prevState.isTermCheck}))
    }

    render() {
        return (
            <div className="login-container">
                <div className="page-container">
                    <div className="page-content">
                        <div className="content-wrapper">
                            <div className="content">
                                <div className="panel login-form custom-panel">
                                    <div className="panel-heading text-center signup-header">
                                        Create an account
                                    </div>
                                    <div className="panel-body" style={{paddingTop:'30px'}}>

                                        {/* <div className="row">
                                            <div className="input-group" style={{margin:'10px'}}>
                                                <span className="input-group-addon">Name</span>
                                                <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange}/>
                                            </div>
                                            <div className="input-group" style={{margin:'10px'}}>
                                                <span className="input-group-addon">Mail</span>
                                                <input type="email" className="form-control" value={this.state.email} onChange={this.handleChangeEmail}/>
                                            </div>
                                            <div className="input-group" style={{margin:'10px'}}>
                                                <span className="input-group-addon">Password</span>
                                                <input type="password" className="form-control" value={this.state.password} onChange={this.handleChangePassword}/>
                                            </div>

                                            <div style={{display:'flex', justifyContent:"space-between", margin:'10px'}}>
                                                <span className="help-block text-left">I accept the <a href='#'>Terms</a></span>
                                                <button type="submit" className="btn btn-rounded" style={{backgroundColor:'rgb(98, 217, 98)', color:'white', width:'100px'}}
                                                    onClick={()=> this.emailSignUp(this.state.email, this.state.password)}
                                                >
                                                    Create
                                                </button>
                                            </div>
                                        </div> */}

                                        <Form>
                                            <div className="row">
                                                <FirstLastNameInput className="form-control custom-input"
                                                    isChanged
                                                    valueOfFirstName = {this.state.firstName}
                                                    valueOfLastName = {this.state.lastName}
                                                    onFirstNameChange = {this.handleFirstNameChange}
                                                    onLastNameChange = {this.handleLastNameChange}
                                                    validations={[required]}
                                                />

                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <Input type="email" className={(!!this.state.error ? 'is-invalid-input':'') + " form-control custom-input"} placeholder="Email"
                                                            isChanged
                                                            value={this.state.email} onChange={this.handleChangeEmail}
                                                            validations={[required, email]}
                                                         />
                                                         {
                                                             !!this.state.error && <span className="text-danger"> This email was already in use. </span>
                                                         }
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <Input type="password" className="form-control custom-input" placeholder="Password"
                                                            isChanged
                                                            name='password'
                                                            value={this.state.password} onChange={this.handleChangePassword}
                                                            minLength = {6}
                                                            validations={[required, password]}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <Input type="password" className="form-control custom-input" placeholder="Repeat password"
                                                            isChanged
                                                            name='confirm'
                                                            validations={[confirm]}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div style={{display:'flex', justifyContent:"space-between", marginTop:'10px', marginBottom:'10px', alignItems:"center"}}>
                                                        <div>
                                                            <Input type="checkbox" validations={[check_required]} checked={this.state.isTermCheck} hidden/>
                                                            <Checkbox
                                                                id="checkbox1"
                                                                checkboxClass="icheckbox_square-blue"
                                                                increaseArea="20%"
                                                                onChange={this.onClickTermCheck}
                                                                checked={this.state.isTermCheck}
                                                            />
                                                            <label htmlFor="checkbox1" style={{color:'rgb(84,90,100)', marginBottom:0, marginLeft:'9px'}}>I accept the <a href='#'>Terms</a></label>
                                                        </div>
                                                        <div>
                                                            <Button type="submit" className="btn btn-rounded custom-button"
                                                                onClick={this.emailSignUp}
                                                            >
                                                                Create
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export const mapStateToProps = state => ({

})

export const mapDispatchToProps = dispatch => bindActionCreators({
    emailSignupAsync
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage)