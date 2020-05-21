import React, { Component } from 'react'
import { connect } from 'react-redux'
import { WithContext as ReactTags } from 'react-tag-input'
import * as axios from 'axios'
import styled from 'styled-components'

import './invite.css'
// import 'react-tag-input/example/reactTags.css'
import { setInvitation } from '../firebase/invitation'
import { setInvitedUserToNote, getInvitedUsers, deleteInvitedUser } from '../firebase/note'


const styles = {
    invited: {
        boxShadow: 'none',
        border: 0,
        padding: '20px 30px 0px 30px',
    },
}

const Wrapper = styled.div`
    margin-top: ${props => props.marginTop};
    display: flex;
    width: 100%;
`

class InvitationEntry extends Component {
    render() {
        const {email, role} = this.props
        let r1 = "", r2 = ""

        if (role === "view")
            r1 = "checked"
        else
            r2 = "checked"

        return (
            <tr>
                <td>{email}</td>
                <td>
                    <div>
                        <label className="radio-inline">
                            <div className="choice"><span className={r1}><input type="radio" name="radio-inline-left" className="styled" onChange={()=>this.props.onRoleChange(email, 'view')}/></span></div>
                            View
                        </label>

                        <label className="radio-inline">
                            <div className="choice"><span className={r2}><input type="radio" name="radio-inline-left" className="styled" onChange={()=>this.props.onRoleChange(email, 'edit')}/></span></div>
                            Edit
                        </label>
                    </div>
                </td>
                <td>
                    <button type="button" className="btn btn-default" onClick={()=>this.props.onDelete(email)}>Delete</button>
                </td>
            </tr>
        )
    }
}

class InviteInput extends Component {
    constructor(props) {
        super(props)
 
        this.state = {
            tags: [], //[{ id: 1, text: "Thailand" }, { id: 2, text: "India" }],
            // suggestions: ['Russia', 'dd'],
            invitedUsers: [],

        }
        this.handleDelete = this.handleDelete.bind(this)
        this.handleAddition = this.handleAddition.bind(this)
        this.handleDrag = this.handleDrag.bind(this)

        getInvitedUsers(this.props.noteid).then((invitedUsers) => {
            this.setState({ invitedUsers })
        })
    }

    sendInvitationEmail(from, to, noteid){
        var postData = {
            from,
            to,
            for: `http://localhost:3000/note/n/${noteid}/`,
        }        
        var url = 'http://localhost:3001/api/send_invitation_email'
        axios.post(url, postData)
    }

    _onInviteClick() {
        const to = this.state.tags.map((item) => item.text)
        const defaultRole = 'view'
        const {uid, email, noteid} = this.props
        const {invitedUsers} = this.state

        to.forEach((toEach) => {
            setInvitation({uid, email}, toEach, noteid, defaultRole)
            setInvitedUserToNote(noteid, toEach, defaultRole).then(() => {
                if(!!(invitedUsers.find((invited) => toEach === invited.email )) ) return
                invitedUsers.push({email: toEach, role: defaultRole})
                this.setState({invitedUsers})
            })
        })
        this.sendInvitationEmail(email, to, noteid)

        this.setState({tags: []})
    }

    _onRoleChange(to, role) {
        const {uid, email, noteid} = this.props
        setInvitation({uid, email}, to, noteid, role)
        setInvitedUserToNote(noteid, to, role).then(() => {
            const {invitedUsers} = this.state
            for (let i = 0; i < invitedUsers.length; i++) { 
                if(invitedUsers[i].email === to) {
                    invitedUsers[i].role = role
                    this.setState({invitedUsers})
                    return
                }
            }
        })
    }

    _onDelete(to) {
        const {uid, email, noteid} = this.props
        setInvitation({uid, email}, to, noteid, "")
        deleteInvitedUser(noteid, to).then(() => {
            const {invitedUsers} = this.state
            for (let i = 0; i < invitedUsers.length; i++) { 
                if(invitedUsers[i].email === to) {
                    invitedUsers.splice(i, 1)
                    this.setState({invitedUsers})
                    return
                }
            }
        })
    }

    handleDelete(i) {
        let tags = this.state.tags
        tags.splice(i, 1)
        this.setState({tags: tags})
    }
 
    handleAddition(tag) {
        let tags = this.state.tags
        tags.push({
            id: tags.length + 1,
            text: tag
        })
        this.setState({tags: tags})
    }
 
    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags
 
        // mutate array 
        tags.splice(currPos, 1)
        tags.splice(newPos, 0, tag)
 
        // re-render 
        this.setState({ tags: tags })
    }

    render() {
        const {tags/*, suggestions */, invitedUsers} = this.state
        const {noteid} = this.props

        return  (
            <div>
                <Wrapper {...this.props}>
                    <ReactTags
                        tags={tags}
                        classNames={{
                            tags: 'ReactTags__tags',
                            tagInput: 'ReactTags__tagInput',
                            tagInputField: 'ReactTags__tagInputField',
                            selected: 'ReactTags__selected',
                            tag: 'ReactTags__selected ReactTags__tag',
                            remove: 'ReactTags__selected ReactTags__remove',
                            // suggestions: 'ReactTags__suggestions',
                            // activeSuggestion: 'ReactTags__activeSuggestion'
                        }}
                        /* suggestions={suggestions} */
                        placeholder="user@example.com"
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        handleDrag={this.handleDrag}
                    />
                    <button type="button" className="btn btn-primary" style={{height: '38px', borderRadius:0}} onClick={this._onInviteClick.bind(this)}>Invite</button>
                </Wrapper>

                <div className="panel panel-flat" style={styles.invited}>
                    <div className="panel-heading">
                        <h5 className="panel-title">Users invited to this note</h5>
                    </div>

                    <div className="panel-body">
                        <div className="table-responsive">
                            <table className="table text-nowrap">
                                <thead>
                                    <tr>
                                        <th style={{width:'40%'}}>Email</th>
                                        <th>Permission</th>
                                        <th style={{width:'20px'}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !!invitedUsers && invitedUsers.map( ({email, role}) => <InvitationEntry key={email} email={email} role={role} onRoleChange={this._onRoleChange.bind(this)} onDelete={this._onDelete.bind(this)}/> )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    uid: state.auth.uid,
    email: state.auth.email,
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(InviteInput)