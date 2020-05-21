import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { logOut } from '../actions/auth'


export const Wrapper = styled.div`
    width: 100vw;
    display: flex;
    justify-content: space-between;
    padding: 20px 5%;
`

class Header extends Component {
    render () {
        const {photoURL, displayName} = this.props

        return (
            <Wrapper>
                <div style={{display:'flex', alignItems:'center'}}>
                    <div className="thumbnail" style={{margin:'0'}}>
                        <a href={photoURL} data-popup="lightbox">
                            <img src={photoURL} alt="" style={{width:'64px', height:'64px'}}/>
                        </a>
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;{ displayName }
                </div>

                <div>
                    <button className="btn bg-default" type="button" onClick={this.props.logOut}> Log out </button>
                </div>
            </Wrapper>
        )
    }
}

const mapStateToProps = (state) => ({
    photoURL: state.auth.photoURL,
    displayName: state.auth.displayName
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    logOut,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)