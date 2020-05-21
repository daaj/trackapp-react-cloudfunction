import React, { Component } from 'react'
import * as firebase from 'firebase'
import shortid from 'shortid'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { history } from '../store/index'
import { newNote } from '../firebase/note'
import { newRole } from '../firebase/role'

import Header from '../components/header'


const styles = {
    container: {
        display:'flex',
        alignItems:'center',
        flexDirection:'column',
    },
    panel: {
        width:'600px',
    }
}

const NoteEntry = (props) => {
    return (
        <tr>   
            <td>
                <Link to={{pathname: props.uri/*, search: `?title=${props.title}`*/}}> {props.title} </Link>
            </td>
            <td>
                <span className="text-muted text-size-small"> {props.role} </span>
            </td>
        </tr>
    )
}

class Home extends Component {
    constructor(props){
        super(props)

        this.state = {
            title: '',
            notes: [],
        }

        this._onNewClick = this._onNewClick.bind(this)
        this._onTitleChange = this._onTitleChange.bind(this)
    }

    // componentDidMount() {
    //     const userid = this.props.uid
    //     const _this = this
        
    //     var rolesRef = firebase.database().ref(`/roles/users/${userid}/notes/`)
    //     rolesRef.on('value', function(snapshot) {
    //         let notes = []

    //         snapshot.forEach((childSnapshot) => {
    //             notes.push({ title: childSnapshot.val().title, noteid: childSnapshot.key })
    //         })

    //         _this.setState({notes})
    //     });
    // }

    // componentWillUnmount() {
    //     const userid = this.props.uid

    //     var rolesRef = firebase.database().ref(`/roles/users/${userid}/notes/`)
    //     rolesRef.off('value')
    // }

    _onNewClick() {
        const userid = this.props.uid
        const noteid = shortid.generate()
        
        // firebase.database().ref(`/users/${userid}/notes/${noteid}`).set({
        //     title: this.state.title,
        // })
        newRole(userid, noteid, 'owner')
        newNote(noteid, this.state.title)

        // browserHistory.push(`/users/${userid}/notes/${noteid}?title=${this.state.title}`)
        history.push(`/note/n/${noteid}/`)
    }

    _onTitleChange(e) {
        this.setState({title: e.target.value})
    }

    render() {
        const {userid, notes} = this.props

        return(
            <div className="content" style={styles.container}>
                <Header />
                <div className="panel panel-flat" style={styles.panel}>
                    <div className="panel-heading">
                        <h5 className="panel-title">Notes</h5>
                    </div>
                    <div className="panel-body">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Title" value={this.state.title} onChange={this._onTitleChange} />
                            <span className="input-group-btn">
                                <button className="btn bg-teal" type="button" onClick={this._onNewClick}> New </button>
                            </span>
                        </div>
                        <br/>
                    {/* </div>
                </div>

                <div className="panel panel-flat" style={styles.panel}>
                    <div className="panel-body"> */}
                        <div className="table-responsive">
                            <table className="table text-nowrap">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th style={{width:'20px'}}>Permission</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {   !!notes &&
                                    Object.keys(notes).map((key) =>
                                        <NoteEntry key={key} title={notes[key].title} role={notes[key].role} uri={`/note/n/${key}/`}/>
                                    )
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
    notes: state.notes
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
