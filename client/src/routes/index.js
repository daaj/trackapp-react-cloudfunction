import React, { Component } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

// import { history } from '../store'

import { checkRole } from '../firebase/role'

import LoginPage from '../containers/login'
import SignupPage from '../containers/signup'
import ResetPasswordForm from '../containers/reset'
import Home from '../containers/home'
import Note from '../containers/note'


const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
    uid: state.auth.uid
})

const PortalRoute = withRouter(connect(mapStateToProps)(
    ({ component: Component, isLoggedIn, /*location,*/ ...rest }) => {
        // location === history.location
        return (
            <Route {...rest} render={props => (
                !isLoggedIn ? (
                    <Component {...props}/>
                ) : (
                    <Redirect to={{
                        pathname: !props.location.state ? '/note/u/' : props.location.state.from.pathname,
                        state: { from: props.location }
                    }}/>
                )
            )}/>
        )
    }
))

const PrivateRoute = withRouter(connect(mapStateToProps)(
    ({ component: Component, isLoggedIn, ...rest }) => (
        <Route {...rest} render={props => (
            isLoggedIn ? (
                <Component {...props}/>
            ) : (
                <Redirect to={{
                    pathname: '/login/',
                    state: { from: props.location }
                }}/>
            )
        )}/>
    )
))

class PendingRoute extends Component {
    constructor(props) {
        super(props)

        this.state = {
            checked: false,
            role: null,
        }
    }

    componentDidMount() {
        const _this = this
        checkRole(this.props.uid, this.props.noteid).then((role) => {
            _this.setState({role, checked:true})
        })
    }

    render() {
        const {checked, role} = this.state
        // const returnValue = <this.props.component {...this.props}/>
        // return returnValue

        // if (!checked) {
        //     return <div/>
        // } else if(this.props.isLoggedIn && isValid) {
        //     return <this.props.component {...this.props}/>
        // } else {
        //     return <Redirect to={{
        //         pathname: '/note/u/',
        //         state: { from: this.props.location }
        //     }}/>
        // }
        
        return (
            !checked ? null: (
                this.props.isLoggedIn && !!role ? (
                    <this.props.component {...this.props} role={role} />
                ) : (
                    <Redirect to={{
                        pathname: '/note/u/',
                        state: { from: this.props.location }
                    }}/>
                )
            )
        )
    }
}

PendingRoute = connect(mapStateToProps)(PendingRoute)

const NoteRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => <PendingRoute {...props} noteid={props.match.params.noteid} component={Component}/>} />
)

const Routes = () => {
    return (
        <div>
            <PortalRoute exact path="/" component={LoginPage} />
            <PortalRoute path="/login/" component={LoginPage} />
            <PortalRoute path="/signup/" component={SignupPage} />
            <PortalRoute path="/reset/" component={ResetPasswordForm} />
            <PrivateRoute path="/note/u/" component={Home} />
            <NoteRoute path="/note/n/:noteid/" component={Note} />
        </div>
    )   
}

export default Routes