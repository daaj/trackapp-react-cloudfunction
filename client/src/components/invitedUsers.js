import React, { Component } from 'react'
import { getInvitedUsers } from '../firebase/note'

class InvitedUsers extends Component {
    constructor(props) {
        super(props)

        this.state = {
            invitedUsers: []
        }
    }

    componentDidMount() {
        getInvitedUsers(this.props.noteid).then((invitedUsers) => {
            this.setState({ invitedUsers })
        })
    }

    render() {
        const {invitedUsers} = this.state

        return (
            <div style={{margin: '20px'}}>
                <h4> Invited Users </h4>
                {
                    invitedUsers.map(({email, role}) => 
                        // <button className="btn btn-primary" key={email} style={{margin:'10px'}}> {email} </button>
                        <span className="label label-info" key={email} style={{margin:'10px', padding:'10px', fontSize:'11px'}}> {email} </span>
                    )
                }
            </div>
        )
    }
}

export default InvitedUsers