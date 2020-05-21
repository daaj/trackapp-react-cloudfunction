import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { persistStore } from 'redux-persist'

import './App.css'

import './firebase/config'
import store, { history } from './store'
import Routes from './routes'
import { listenToRoles } from './actions/note'


class App extends Component {
    constructor() {
        super()
        this.state = { rehydrated: false }
    }

    componentWillMount(){
        persistStore(store, {}, () => {
            let state = store.getState()
            if(state.auth.isLoggedIn) store.dispatch(listenToRoles(state.auth.uid))
            
            this.setState({ rehydrated: true })
        })
    }

    render() {
        return (
            this.state.rehydrated ?
            <div className="App">
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <Routes />
                    </ConnectedRouter>
                </Provider>
            </div> : null
        )
    }
}

export default App
