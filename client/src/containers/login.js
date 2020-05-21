import React, { Component } from 'react'
import createHistory from 'history/createBrowserHistory'
import * as firebase from 'firebase'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Alert from 'react-s-alert'
// mandatory
import 'react-s-alert/dist/s-alert-default.css'
// optional - you can choose the effect you want
import 'react-s-alert/dist/s-alert-css-effects/scale.css'

import { emailSigninAsync, googleSigninAsync, facebookSigninAsync, getRedirectResultAsync } from '../actions/auth'

import { Checkbox, Radio } from 'react-icheck'
import 'icheck/skins/all.css' // or single skin css

import './signup.css'


const history = createHistory()

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
          value: '',
          email: '',
          password : '',
          searchResults : []
        }
    
        this.handleChange = this.handleChange.bind(this)

        this.history = createHistory()

        this.props.getRedirectResultAsync()
    }


    googleSignin(){
        this.props.googleSigninAsync()
    }

    facebookSignin(){
        this.props.facebookSigninAsync()
    }

    emailSignin(email, password){
        this.props.emailSigninAsync(email, password)
        .catch((error) => {
            // Alert.closeAll()
            
            Alert.error('Invalid Login or password.', {
                position: 'bottom',
                effect: 'scale',
                timeout: 'none'
            })
        })
    }

    handleChange(event) {
        this.setState({value: event.target.value})
    }

    handleChangeEmail= (event) => {    
        this.setState({email: event.target.value})
    } 

    handleChangePassword = (event) => {
        this.setState({password: event.target.value})
    } 

    render() {
        return (
            <div className="login-container">
                <Alert stack={{limit: 1}} />

                <div className="page-container">
                    <div className="page-content">
                        <div className="content-wrapper">
                            <div className="content">
                                <div>
                                    <div className="panel panel-body login-form custom-panel" style={{width:'640px'}}>
                                        <div className="row" style={{display:'flex', alignItems:'center'}}>
                                            <div className="col-xs-6" style={{padding:'0px 35px'}}>
                                                <div className="mycontent-left">
                                                    <div className="form-group text-center" style={{display:'flex', flexDirection:'column'}}>
                                                        <button type="button" className="btn btn-xlg" style={{backgroundColor:'rgb(80,124,192)', color:'white', marginBottom:30, display:'flex', alignItems:'center', borderRadius:'8px'}}
                                                            onClick={this.facebookSignin.bind(this)}
                                                        >
                                                            <i className="icon-facebook position-left"></i>
                                                            <div style={{flex:'auto'}}>
                                                                Login with Facebook
                                                            </div>
                                                        </button>

                                                        <button type="button" className="btn btn-xlg" style={{backgroundColor:'rgb(223,73,48)', color:'white', display:'flex', alignItems:'center', borderRadius:'8px'}}
                                                            onClick={this.googleSignin.bind(this)}
                                                        >
                                                            <i className="icon-google-plus position-left"></i>
                                                            <div style={{flex:'auto'}}>
                                                                Login with Google
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-6" style={{padding:'0px 35px'}}>
                                                <div style={{position:'absolute', width:'100%', height:'70%', left:'0%', top:'15%', borderLeft:'2px solid rgb(240,240,240)'}}>
                                                    <div style={{borderRadius:'50%', width:'40px', height:'40px', marginLeft:'-20px', marginTop:'22%', border:'2px solid rgb(240,240,240', backgroundColor:'white', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                                        OR
                                                    </div>
                                                </div>
                                                <div className="mycontent-right">
                                                    <div className="text-center">
                                                        <h5 className="content-group login-title">Sign in manually</h5>
                                                    </div>
                        
                                                    <div className="form-group">
                                                        <input type="text" className="form-control custom-input" placeholder="Email" value={this.state.email} onChange={this.handleChangeEmail}/>
                                                    </div>
                        
                                                    <div className="form-group">
                                                        <input type="password" className="form-control custom-input" placeholder="Password"  value={this.state.password} onChange={this.handleChangePassword}/>
                                                    </div>
                        
                                                    <div className="form-group" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                                        <div>
                                                            <Checkbox
                                                                id="checkbox1"
                                                                checkboxClass="icheckbox_square-blue"
                                                                increaseArea="20%"
                                                            />
                                                            <label htmlFor="checkbox1" style={{color:'rgb(84,90,100)', marginBottom:0, marginLeft:'9px'}}>Remember me</label>
                                                            {/* <label className="checkbox-inline">
                                                                {<input type="checkbox" className="styled" />}
                                                                Remember me
                                                            </label> */}
                                                        </div>
                                                        <div>
                                                            <div className="form-group">
                                                                <button type="submit" className="btn btn-xlg" style={{backgroundColor:'rgb(255, 90, 95)', color:'white', borderRadius:'8px'}} onClick={()=> this.emailSignin(this.state.email, this.state.password)}>LOGIN</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-6 text-left text-center">
                                                            <Link to="/signup/">Register now</Link>
                                                        </div>
                                                        <div className="col-sm-6 text-right text-center">
                                                            {/* <div style={{position:'absolute', width:'100%', height:'70%', left:'0%', top:'15%', borderLeft:'2px solid rgb(240,240,240)'}}> </div> */}
                                                            <Link to="/reset/">Forgot password?</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

const mapStateToProps = state => ({
    // isLoggedIn: state.auth.isLoggedIn
})
  
const mapDispatchToProps = dispatch => bindActionCreators({
    emailSigninAsync,
    googleSigninAsync,
    facebookSigninAsync,
    getRedirectResultAsync,
    // changePage: () => push('/about-us')
}, dispatch)
  
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)